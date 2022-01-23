import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Chat } from '../models/chat';
import { Participant } from '../models/participant';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public static collectionName: string = 'chats';

  constructor(
    private firestore: AngularFirestore
  ) {

  }

  addChat(msg: string) {
    this.firestore.collection(ChatService.collectionName).add({
      msg,
      from: firebase.auth().currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  getUsers() {
    return this.firestore.collection(AuthService.collectionName).valueChanges({idField: 'uid'}) as Observable<Participant[]>;
  }

  getUserForMessage(msgFromId, users: Participant[]): string {
    for(const usr of users) {
      if(usr.uid === msgFromId) {
        return usr.email;
      }
    }
  }

  getMessages() {
    let users = [];

    return this.getUsers().pipe(
      switchMap( results => {
        users = results;
        return this.firestore.collection(ChatService.collectionName, ref => ref.orderBy('createdAt')).valueChanges({idField: 'id'}) as Observable<Chat[]>;
      }),
      map(messages => {
        for(const msg of messages) {
          msg.fromName = this.getUserForMessage(msg.from, users);
          msg.myMsg = firebase.auth().currentUser.uid === msg.from;
        }
        //console.log('All Messages: ', messages);
        return messages;
      })
    );
  }
}

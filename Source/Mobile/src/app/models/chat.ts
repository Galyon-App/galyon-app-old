import firebase from 'firebase/app';

export interface Chat {
  id: string;
  from: string;
  fromName: string;
  msg: string;
  myMsg: boolean;
  createdAt: firebase.firestore.FieldValue;
}

/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  loader: any;
  isLoading = false;
  details: any;
  private address = new Subject<any>();
  private coupon = new Subject<any>();
  private review = new Subject<any>();
  orders: any;
  private changeLocation = new Subject<any>();
  private loggedIn = new Subject<any>();
  private profile = new Subject<any>();
  public newOrder = new Subject<any>();
  public appPage: any[] = [];
  public appClosed: boolean;
  public appClosedMessage: any = '';
  public translations: any[] = [];
  public direction: any;
  public currecny: any;
  public cside: any;
  public userInfo: any;
  public selectedCity = new Subject<any>();
  public city: any;

  public stripe: any;
  public stripeCode: any;
  public general: any;

  public twillo: any;
  public logo: any;
  public delivery: any;
  public countrys = [
    {
      country_code: 'AF',
      country_name: 'Afghanistan',
      dialling_code: '93'
    },
    {
      country_code: 'AL',
      country_name: 'Albania',
      dialling_code: '355'
    },
    {
      country_code: 'DZ',
      country_name: 'Algeria',
      dialling_code: '213'
    },
    {
      country_code: 'AS',
      country_name: 'American Samoa',
      dialling_code: '1'
    },
    {
      country_code: 'AD',
      country_name: 'Andorra',
      dialling_code: '376'
    },
    {
      country_code: 'AO',
      country_name: 'Angola',
      dialling_code: '244'
    },
    {
      country_code: 'AI',
      country_name: 'Anguilla',
      dialling_code: '1'
    },
    {
      country_code: 'AG',
      country_name: 'Antigua',
      dialling_code: '1'
    },
    {
      country_code: 'AR',
      country_name: 'Argentina',
      dialling_code: '54'
    },
    {
      country_code: 'AM',
      country_name: 'Armenia',
      dialling_code: '374'
    },
    {
      country_code: 'AW',
      country_name: 'Aruba',
      dialling_code: '297'
    },
    {
      country_code: 'AU',
      country_name: 'Australia',
      dialling_code: '61'
    },
    {
      country_code: 'AI',
      country_name: 'Austria',
      dialling_code: '43'
    },
    {
      country_code: 'AZ',
      country_name: 'Azerbaijan',
      dialling_code: '994'
    },
    {
      country_code: 'BH',
      country_name: 'Bahrain',
      dialling_code: '973'
    },
    {
      country_code: 'BD',
      country_name: 'Bangladesh',
      dialling_code: '880'
    },
    {
      country_code: 'BB',
      country_name: 'Barbados',
      dialling_code: '1'
    },
    {
      country_code: 'BY',
      country_name: 'Belarus',
      dialling_code: '375'
    },
    {
      country_code: 'BE',
      country_name: 'Belgium',
      dialling_code: '32'
    },
    {
      country_code: 'BZ',
      country_name: 'Belize',
      dialling_code: '501'
    },
    {
      country_code: 'BJ',
      country_name: 'Benin',
      dialling_code: '229'
    },
    {
      country_code: 'BM',
      country_name: 'Bermuda',
      dialling_code: '1'
    },
    {
      country_code: 'BT',
      country_name: 'Bhutan',
      dialling_code: '975'
    },
    {
      country_code: 'BO',
      country_name: 'Bolivia',
      dialling_code: '591'
    },
    {
      country_code: 'BA',
      country_name: 'Bosnia and Herzegovina',
      dialling_code: '387'
    },
    {
      country_code: 'BW',
      country_name: 'Botswana',
      dialling_code: '267'
    },
    {
      country_code: 'BR',
      country_name: 'Brazil',
      dialling_code: '55'
    },
    {
      country_code: 'IO',
      country_name: 'British Indian Ocean Territory',
      dialling_code: '246'
    },
    {
      country_code: 'VG',
      country_name: 'British Virgin Islands',
      dialling_code: '1'
    },
    {
      country_code: 'BN',
      country_name: 'Brunei',
      dialling_code: '673'
    },
    {
      country_code: 'BG',
      country_name: 'Bulgaria',
      dialling_code: '359'
    },
    {
      country_code: 'BF',
      country_name: 'Burkina Faso',
      dialling_code: '226'
    },
    {
      country_code: 'MM',
      country_name: 'Burma Myanmar',
      dialling_code: '95'
    },
    {
      country_code: 'BI',
      country_name: 'Burundi',
      dialling_code: '257'
    },
    {
      country_code: 'KH',
      country_name: 'Cambodia',
      dialling_code: '855'
    },
    {
      country_code: 'CM',
      country_name: 'Cameroon',
      dialling_code: '237'
    },
    {
      country_code: 'CA',
      country_name: 'Canada',
      dialling_code: '1'
    },
    {
      country_code: 'CV',
      country_name: 'Cape Verde',
      dialling_code: '238'
    },
    {
      country_code: 'KY',
      country_name: 'Cayman Islands',
      dialling_code: '1'
    },
    {
      country_code: 'CF',
      country_name: 'Central African Republic',
      dialling_code: '236'
    },
    {
      country_code: 'ID',
      country_name: 'Chad',
      dialling_code: '235'
    },
    {
      country_code: 'CL',
      country_name: 'Chile',
      dialling_code: '56'
    },
    {
      country_code: 'CN',
      country_name: 'China',
      dialling_code: '86'
    },
    {
      country_code: 'CO',
      country_name: 'Colombia',
      dialling_code: '57'
    },
    {
      country_code: 'KM',
      country_name: 'Comoros',
      dialling_code: '269'
    },
    {
      country_code: 'CK',
      country_name: 'Cook Islands',
      dialling_code: '682'
    },
    {
      country_code: 'CR',
      country_name: 'Costa Rica',
      dialling_code: '506'
    },
    {
      country_code: 'CI',
      country_name: `Côte d'Ivoire`,
      dialling_code: '225'
    },
    {
      country_code: 'HR',
      country_name: 'Croatia',
      dialling_code: '385'
    },
    {
      country_code: 'CU',
      country_name: 'Cuba',
      dialling_code: '53'
    },
    {
      country_code: 'CY',
      country_name: 'Cyprus',
      dialling_code: '357'
    },
    {
      country_code: 'CZ',
      country_name: 'Czech Republic',
      dialling_code: '420'
    },
    {
      country_code: 'CD',
      country_name: 'Democratic Republic of Congo',
      dialling_code: '243'
    },
    {
      country_code: 'DK',
      country_name: 'Denmark',
      dialling_code: '45'
    },
    {
      country_code: 'DJ',
      country_name: 'Djibouti',
      dialling_code: '253'
    },
    {
      country_code: 'DM',
      country_name: 'Dominica',
      dialling_code: '1'
    },
    {
      country_code: 'DO',
      country_name: 'Dominican Republic',
      dialling_code: '1'
    },
    {
      country_code: 'EC',
      country_name: 'Ecuador',
      dialling_code: '593'
    },
    {
      country_code: 'EG',
      country_name: 'Egypt',
      dialling_code: '20'
    },
    {
      country_code: 'SV',
      country_name: 'El Salvador',
      dialling_code: '503'
    },
    {
      country_code: 'GQ',
      country_name: 'Equatorial Guinea',
      dialling_code: '240'
    },
    {
      country_code: 'ER',
      country_name: 'Eritrea',
      dialling_code: '291'
    },
    {
      country_code: 'EE',
      country_name: 'Estonia',
      dialling_code: '372'
    },
    {
      country_code: 'ET',
      country_name: 'Ethiopia',
      dialling_code: '251'
    },
    {
      country_code: 'FK',
      country_name: 'Falkland Islands',
      dialling_code: '500'
    },
    {
      country_code: 'FO',
      country_name: 'Faroe Islands',
      dialling_code: '298'
    },
    {
      country_code: 'FM',
      country_name: 'Federated States of Micronesia',
      dialling_code: '691'
    },
    {
      country_code: 'FJ',
      country_name: 'Fiji',
      dialling_code: '679'
    },
    {
      country_code: 'FI',
      country_name: 'Finland',
      dialling_code: '358'
    },
    {
      country_code: 'FR',
      country_name: 'France',
      dialling_code: '33'
    },
    {
      country_code: 'GF',
      country_name: 'French Guiana',
      dialling_code: '594'
    },
    {
      country_code: 'PF',
      country_name: 'French Polynesia',
      dialling_code: '689'
    },
    {
      country_code: 'GA',
      country_name: 'Gabon',
      dialling_code: '241'
    },
    {
      country_code: 'GE',
      country_name: 'Georgia',
      dialling_code: '995'
    },
    {
      country_code: 'DE',
      country_name: 'Germany',
      dialling_code: '49'
    },
    {
      country_code: 'GH',
      country_name: 'Ghana',
      dialling_code: '233'
    },
    {
      country_code: 'GI',
      country_name: 'Gibraltar',
      dialling_code: '350'
    },
    {
      country_code: 'GR',
      country_name: 'Greece',
      dialling_code: '30'
    },
    {
      country_code: 'GL',
      country_name: 'Greenland',
      dialling_code: '299'
    },
    {
      country_code: 'GD',
      country_name: 'Grenada',
      dialling_code: '1'
    },
    {
      country_code: 'GP',
      country_name: 'Guadeloupe',
      dialling_code: '590'
    },
    {
      country_code: 'GU',
      country_name: 'Guam',
      dialling_code: '1'
    },
    {
      country_code: 'GT',
      country_name: 'Guatemala',
      dialling_code: '502'
    },
    {
      country_code: 'GN',
      country_name: 'Guinea',
      dialling_code: '224'
    },
    {
      country_code: 'GW',
      country_name: 'Guinea-Bissau',
      dialling_code: '245'
    },
    {
      country_code: 'GY',
      country_name: 'Guyana',
      dialling_code: '592'
    },
    {
      country_code: 'HT',
      country_name: 'Haiti',
      dialling_code: '509'
    },
    {
      country_code: 'HN',
      country_name: 'Honduras',
      dialling_code: '504'
    },
    {
      country_code: 'HK',
      country_name: 'Hong Kong',
      dialling_code: '852'
    },
    {
      country_code: 'HU',
      country_name: 'Hungary',
      dialling_code: '36'
    },
    {
      country_code: 'IS',
      country_name: 'Iceland',
      dialling_code: '354'
    },
    {
      country_code: 'IN',
      country_name: 'India',
      dialling_code: '91'
    },
    {
      country_code: 'ID',
      country_name: 'Indonesia',
      dialling_code: '62'
    },
    {
      country_code: 'IR',
      country_name: 'Iran',
      dialling_code: '98'
    },
    {
      country_code: 'IQ',
      country_name: 'Iraq',
      dialling_code: '964'
    },
    {
      country_code: 'IE',
      country_name: 'Ireland',
      dialling_code: '353'
    },
    {
      country_code: 'IL',
      country_name: 'Israel',
      dialling_code: '972'
    },
    {
      country_code: 'IT',
      country_name: 'Italy',
      dialling_code: '39'
    },
    {
      country_code: 'JM',
      country_name: 'Jamaica',
      dialling_code: '1'
    },
    {
      country_code: 'JP',
      country_name: 'Japan',
      dialling_code: '81'
    },
    {
      country_code: 'JO',
      country_name: 'Jordan',
      dialling_code: '962'
    },
    {
      country_code: 'KZ',
      country_name: 'Kazakhstan',
      dialling_code: '7'
    },
    {
      country_code: 'KE',
      country_name: 'Kenya',
      dialling_code: '254'
    },
    {
      country_code: 'KI',
      country_name: 'Kiribati',
      dialling_code: '686'
    },
    {
      country_code: 'XK',
      country_name: 'Kosovo',
      dialling_code: '381'
    },
    {
      country_code: 'KW',
      country_name: 'Kuwait',
      dialling_code: '965'
    },
    {
      country_code: 'KG',
      country_name: 'Kyrgyzstan',
      dialling_code: '996'
    },
    {
      country_code: 'LA',
      country_name: 'Laos',
      dialling_code: '856'
    },
    {
      country_code: 'LV',
      country_name: 'Latvia',
      dialling_code: '371'
    },
    {
      country_code: 'LB',
      country_name: 'Lebanon',
      dialling_code: '961'
    },
    {
      country_code: 'LS',
      country_name: 'Lesotho',
      dialling_code: '266'
    },
    {
      country_code: 'LR',
      country_name: 'Liberia',
      dialling_code: '231'
    },
    {
      country_code: 'LY',
      country_name: 'Libya',
      dialling_code: '218'
    },
    {
      country_code: 'LI',
      country_name: 'Liechtenstein',
      dialling_code: '423'
    },
    {
      country_code: 'LT',
      country_name: 'Lithuania',
      dialling_code: '370'
    },
    {
      country_code: 'LU',
      country_name: 'Luxembourg',
      dialling_code: '352'
    },
    {
      country_code: 'MO',
      country_name: 'Macau',
      dialling_code: '853'
    },
    {
      country_code: 'MK',
      country_name: 'Macedonia',
      dialling_code: '389'
    },
    {
      country_code: 'MG',
      country_name: 'Madagascar',
      dialling_code: '261'
    },
    {
      country_code: 'MW',
      country_name: 'Malawi',
      dialling_code: '265'
    },
    {
      country_code: 'MY',
      country_name: 'Malaysia',
      dialling_code: '60'
    },
    {
      country_code: 'MV',
      country_name: 'Maldives',
      dialling_code: '960'
    },
    {
      country_code: 'ML',
      country_name: 'Mali',
      dialling_code: '223'
    },
    {
      country_code: 'MT',
      country_name: 'Malta',
      dialling_code: '356'
    },
    {
      country_code: 'MH',
      country_name: 'Marshall Islands',
      dialling_code: '692'
    },
    {
      country_code: 'MQ',
      country_name: 'Martinique',
      dialling_code: '596'
    },
    {
      country_code: 'MR',
      country_name: 'Mauritania',
      dialling_code: '222'
    },
    {
      country_code: 'MU',
      country_name: 'Mauritius',
      dialling_code: '230'
    },
    {
      country_code: 'YT',
      country_name: 'Mayotte',
      dialling_code: '262'
    },
    {
      country_code: 'MX',
      country_name: 'Mexico',
      dialling_code: '52'
    },
    {
      country_code: 'MD',
      country_name: 'Moldova',
      dialling_code: '373'
    },
    {
      country_code: 'MC',
      country_name: 'Monaco',
      dialling_code: '377'
    },
    {
      country_code: 'MN',
      country_name: 'Mongolia',
      dialling_code: '976'
    },
    {
      country_code: 'ME',
      country_name: 'Montenegro',
      dialling_code: '382'
    },
    {
      country_code: 'MS',
      country_name: 'Montserrat',
      dialling_code: '1'
    },
    {
      country_code: 'MA',
      country_name: 'Morocco',
      dialling_code: '212'
    },
    {
      country_code: 'MZ',
      country_name: 'Mozambique',
      dialling_code: '258'
    },
    {
      country_code: 'NA',
      country_name: 'Namibia',
      dialling_code: '264'
    },
    {
      country_code: 'NR',
      country_name: 'Nauru',
      dialling_code: '674'
    },
    {
      country_code: 'NP',
      country_name: 'Nepal',
      dialling_code: '977'
    },
    {
      country_code: 'NL',
      country_name: 'Netherlands',
      dialling_code: '31'
    },
    {
      country_code: 'AN',
      country_name: 'Netherlands Antilles',
      dialling_code: '599'
    },
    {
      country_code: 'NC',
      country_name: 'New Caledonia',
      dialling_code: '687'
    },
    {
      country_code: 'NZ',
      country_name: 'New Zealand',
      dialling_code: '64'
    },
    {
      country_code: 'NI',
      country_name: 'Nicaragua',
      dialling_code: '505'
    },
    {
      country_code: 'NE',
      country_name: 'Niger',
      dialling_code: '227'
    },
    {
      country_code: 'NG',
      country_name: 'Nigeria',
      dialling_code: '234'
    },
    {
      country_code: 'NU',
      country_name: 'Niue',
      dialling_code: '683'
    },
    {
      country_code: 'NF',
      country_name: 'Norfolk Island',
      dialling_code: '672'
    },
    {
      country_code: 'KP',
      country_name: 'North Korea',
      dialling_code: '850'
    },
    {
      country_code: 'MP',
      country_name: 'Northern Mariana Islands',
      dialling_code: '1'
    },
    {
      country_code: 'NO',
      country_name: 'Norway',
      dialling_code: '47'
    },
    {
      country_code: 'OM',
      country_name: 'Oman',
      dialling_code: '968'
    },
    {
      country_code: 'PK',
      country_name: 'Pakistan',
      dialling_code: '92'
    },
    {
      country_code: 'PW',
      country_name: 'Palau',
      dialling_code: '680'
    },
    {
      country_code: 'PS',
      country_name: 'Palestine',
      dialling_code: '970'
    },
    {
      country_code: 'PA',
      country_name: 'Panama',
      dialling_code: '507'
    },
    {
      country_code: 'PG',
      country_name: 'Papua New Guinea',
      dialling_code: '675'
    },
    {
      country_code: 'PY',
      country_name: 'Paraguay',
      dialling_code: '595'
    },
    {
      country_code: 'PE',
      country_name: 'Peru',
      dialling_code: '51'
    },
    {
      country_code: 'PH',
      country_name: 'Philippines',
      dialling_code: '63'
    },
    {
      country_code: 'PL',
      country_name: 'Poland',
      dialling_code: '48'
    },
    {
      country_code: 'PT',
      country_name: 'Portugal',
      dialling_code: '351'
    },
    {
      country_code: 'PR',
      country_name: 'Puerto Rico',
      dialling_code: '1'
    },
    {
      country_code: 'QA',
      country_name: 'Qatar',
      dialling_code: '974'
    },
    {
      country_code: 'CG',
      country_name: 'Republic of the Congo',
      dialling_code: '242'
    },
    {
      country_code: 'RE',
      country_name: 'Réunion',
      dialling_code: '262'
    },
    {
      country_code: 'RO',
      country_name: 'Romania',
      dialling_code: '40'
    },
    {
      country_code: 'RU',
      country_name: 'Russia',
      dialling_code: '7'
    },
    {
      country_code: 'RW',
      country_name: 'Rwanda',
      dialling_code: '250'
    },
    {
      country_code: 'BL',
      country_name: 'Saint Barthélemy',
      dialling_code: '590'
    },
    {
      country_code: 'SH',
      country_name: 'Saint Helena',
      dialling_code: '290'
    },
    {
      country_code: 'KN',
      country_name: 'Saint Kitts and Nevis',
      dialling_code: '1'
    },
    {
      country_code: 'MF',
      country_name: 'Saint Martin',
      dialling_code: '590'
    },
    {
      country_code: 'PM',
      country_name: 'Saint Pierre and Miquelon',
      dialling_code: '508'
    },
    {
      country_code: 'VC',
      country_name: 'Saint Vincent and the Grenadines',
      dialling_code: '1'
    },
    {
      country_code: 'WS',
      country_name: 'Samoa',
      dialling_code: '685'
    },
    {
      country_code: 'SM',
      country_name: 'San Marino',
      dialling_code: '378'
    },
    {
      country_code: 'ST',
      country_name: 'São Tomé and Príncipe',
      dialling_code: '239'
    },
    {
      country_code: 'SA',
      country_name: 'Saudi Arabia',
      dialling_code: '966'
    },
    {
      country_code: 'SN',
      country_name: 'Senegal',
      dialling_code: '221'
    },
    {
      country_code: 'RS',
      country_name: 'Serbia',
      dialling_code: '381'
    },
    {
      country_code: 'SC',
      country_name: 'Seychelles',
      dialling_code: '248'
    },
    {
      country_code: 'SL',
      country_name: 'Sierra Leone',
      dialling_code: '232'
    },
    {
      country_code: 'SG',
      country_name: 'Singapore',
      dialling_code: '65'
    },
    {
      country_code: 'SK',
      country_name: 'Slovakia',
      dialling_code: '421'
    },
    {
      country_code: 'SI',
      country_name: 'Slovenia',
      dialling_code: '386'
    },
    {
      country_code: 'SB',
      country_name: 'Solomon Islands',
      dialling_code: '677'
    },
    {
      country_code: 'SO',
      country_name: 'Somalia',
      dialling_code: '252'
    },
    {
      country_code: 'ZA',
      country_name: 'South Africa',
      dialling_code: '27'
    },
    {
      country_code: 'KR',
      country_name: 'South Korea',
      dialling_code: '82'
    },
    {
      country_code: 'ES',
      country_name: 'Spain',
      dialling_code: '34'
    },
    {
      country_code: 'LK',
      country_name: 'Sri Lanka',
      dialling_code: '94'
    },
    {
      country_code: 'LC',
      country_name: 'St. Lucia',
      dialling_code: '1'
    },
    {
      country_code: 'SD',
      country_name: 'Sudan',
      dialling_code: '249'
    },
    {
      country_code: 'SR',
      country_name: 'Suriname',
      dialling_code: '597'
    },
    {
      country_code: 'SZ',
      country_name: 'Swaziland',
      dialling_code: '268'
    },
    {
      country_code: 'SE',
      country_name: 'Sweden',
      dialling_code: '46'
    },
    {
      country_code: 'CH',
      country_name: 'Switzerland',
      dialling_code: '41'
    },
    {
      country_code: 'SY',
      country_name: 'Syria',
      dialling_code: '963'
    },
    {
      country_code: 'TW',
      country_name: 'Taiwan',
      dialling_code: '886'
    },
    {
      country_code: 'TJ',
      country_name: 'Tajikistan',
      dialling_code: '992'
    },
    {
      country_code: 'TZ',
      country_name: 'Tanzania',
      dialling_code: '255'
    },
    {
      country_code: 'TH',
      country_name: 'Thailand',
      dialling_code: '66'
    },
    {
      country_code: 'BS',
      country_name: 'The Bahamas',
      dialling_code: '1'
    },
    {
      country_code: 'GM',
      country_name: 'The Gambia',
      dialling_code: '220'
    },
    {
      country_code: 'TL',
      country_name: 'Timor-Leste',
      dialling_code: '670'
    },
    {
      country_code: 'TG',
      country_name: 'Togo',
      dialling_code: '228'
    },
    {
      country_code: 'TK',
      country_name: 'Tokelau',
      dialling_code: '690'
    },
    {
      country_code: 'TO',
      country_name: 'Tonga',
      dialling_code: '676'
    },
    {
      country_code: 'TT',
      country_name: 'Trinidad and Tobago',
      dialling_code: '1'
    },
    {
      country_code: 'TN',
      country_name: 'Tunisia',
      dialling_code: '216'
    },
    {
      country_code: 'TR',
      country_name: 'Turkey',
      dialling_code: '90'
    },
    {
      country_code: 'TM',
      country_name: 'Turkmenistan',
      dialling_code: '993'
    },
    {
      country_code: 'TC',
      country_name: 'Turks and Caicos Islands',
      dialling_code: '1'
    },
    {
      country_code: 'TV',
      country_name: 'Tuvalu',
      dialling_code: '688'
    },
    {
      country_code: 'UG',
      country_name: 'Uganda',
      dialling_code: '256'
    },
    {
      country_code: 'UA',
      country_name: 'Ukraine',
      dialling_code: '380'
    },
    {
      country_code: 'AE',
      country_name: 'United Arab Emirates',
      dialling_code: '971'
    },
    {
      country_code: 'GB',
      country_name: 'United Kingdom',
      dialling_code: '44'
    },
    {
      country_code: 'US',
      country_name: 'United States',
      dialling_code: '1'
    },
    {
      country_code: 'UY',
      country_name: 'Uruguay',
      dialling_code: '598'
    },
    {
      country_code: 'VI',
      country_name: 'US Virgin Islands',
      dialling_code: '1'
    },
    {
      country_code: 'UZ',
      country_name: 'Uzbekistan',
      dialling_code: '998'
    },
    {
      country_code: 'VU',
      country_name: 'Vanuatu',
      dialling_code: '678'
    },
    {
      country_code: 'VA',
      country_name: 'Vatican City',
      dialling_code: '39'
    },
    {
      country_code: 'VE',
      country_name: 'Venezuela',
      dialling_code: '58'
    },
    {
      country_code: 'VN',
      country_name: 'Vietnam',
      dialling_code: '84'
    },
    {
      country_code: 'WF',
      country_name: 'Wallis and Futuna',
      dialling_code: '681'
    },
    {
      country_code: 'YE',
      country_name: 'Yemen',
      dialling_code: '967'
    },
    {
      country_code: 'ZM',
      country_name: 'Zambia',
      dialling_code: '260'
    },
    {
      country_code: 'ZW',
      country_name: 'Zimbabwe',
      dialling_code: '263'
    }
  ];
  public user_login: any = '0';
  public reset_pwd: any = '0';

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public router: Router,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private storage: Storage
  ) {
    this.appPage = [
      {
        title: 'Home',
        url: 'tabs/tab1',
        icon: 'assets/sidemenu/home.png',
        icon2: 'assets/sidemenu/home2.png',
        icn: 'home-outline'
      },
      {
        title: 'History',
        url: 'tabs/tab1',
        icon: 'assets/sidemenu/home.png',
        icon2: 'assets/sidemenu/home2.png',
        icn: 'document-text-outline'
      },
      {
        title: 'Profile',
        url: 'tabs/tab2/edit-profile',
        icon: 'assets/sidemenu/user.png',
        icon2: 'assets/sidemenu/user2.png',
        icn: 'person-outline'
      },
      {
        title: 'Language',
        url: 'tabs/tab2/languages',
        icon: 'assets/sidemenu/language.png',
        icon2: 'assets/sidemenu/language2.png',
        icn: 'language-outline'
      },
      {
        title: 'About',
        url: 'tabs/tab2/about',
        icon: 'assets/sidemenu/info.png',
        icon2: 'assets/sidemenu/info2.png',
        icn: 'alert-circle-outline'
      },
      {
        title: 'Contact us',
        url: 'tabs/tab2/contact',
        icon: 'assets/sidemenu/contact.png',
        icon2: 'assets/sidemenu/contact2.png',
        icn: 'mail-outline'
      },
      {
        title: 'FAQs',
        url: 'tabs/tab2/faqs',
        icon: 'assets/sidemenu/contact.png',
        icon2: 'assets/sidemenu/contact2.png',
        icn: 'flag-outline'
      },
      {
        title: 'Help',
        url: 'tabs/tab2/help',
        icon: 'assets/sidemenu/contact.png',
        icon2: 'assets/sidemenu/contact2.png',
        icn: 'help-circle-outline'
      },
    ];
  }

  publishAddress(data: any) {
    this.address.next(data);
  }

  publishNewOrder() {
    this.newOrder.next();
  }

  subscribeOrder(): Subject<any> {
    return this.newOrder;
  }

  publishReview(data: any) {
    this.review.next(data);
  }

  publishProfile(data: any) {
    this.profile.next(data);
  }


  observProfile(): Subject<any> {
    return this.profile;
  }

  getReviewObservable(): Subject<any> {
    return this.review;
  }

  publishLocation(data) {
    this.changeLocation.next(data);
  }
  subscribeLocation(): Subject<any> {
    return this.changeLocation;
  }

  publishLoggedIn(data) {
    this.loggedIn.next(data);
  }
  subscribeLoggedIn(): Subject<any> {
    return this.loggedIn;
  }

  publishCity(data) {
    this.selectedCity.next(data);
  }

  subscribeCity(): Subject<any> {
    return this.selectedCity;
  }

  getObservable(): Subject<any> {
    return this.address;
  }

  publishCoupon(data: any) {
    this.coupon.next(data);
  }
  getCouponObservable(): Subject<any> {
    return this.coupon;
  }

  setOrders(data) {
    this.orders = null;
    this.orders = data;
  }

  openMenu() {
    this.menuCtrl.toggle();
  }

  getKeys(key): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.storage.get(key).then((data) => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }

  clearKeys(key) {
    this.storage.remove(key);
  }

  setKeys(key, value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.storage.set(key, value).then((data) => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }

  gerOrder() {
    return this.orders;
  }
  async show(msg?) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: msg,
      spinner: 'bubbles',
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async hide() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  /*
    Show Warning Alert Message
    param : msg = message to display
    Call this method to show Warning Alert,
    */
  async showWarningAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showSimpleAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: '',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  /*
   Show Error Alert Message
   param : msg = message to display
   Call this method to show Error Alert,
   */
  async showErrorAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  /*
     param : email = email to verify
     Call this method to get verify email
     */
  async getEmailFilter(email) {
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(email))) {
      const alert = await this.alertCtrl.create({
        header: 'Warning',
        message: 'Please enter valid email',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    } else {
      return true;
    }
  }


  /*
    Show Toast Message on Screen
     param : msg = message to display, color= background 
     color of toast example dark,danger,light. position  = position of message example top,bottom
     Call this method to show toast message
     */

  async showToast(msg, colors, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: colors,
      position: positon
    });
    toast.present();
  }
  async shoNotification(msg, colors, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 4000,
      color: colors,
      position: positon,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async errorToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  apiErrorHandler(err) {
    // console.log('Error got in service =>', err)
    if (err.status === -1) {
      this.showErrorAlert('Failed To Connect With Server');
    } else if (err.status === 401) {
      this.showErrorAlert('Unauthorized Request!');
      this.navCtrl.navigateRoot('/login');
    } else if (err.status === 500) {
      this.showErrorAlert('Somethimg Went Wrong..');
    }
  }


  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getString(str) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }

}

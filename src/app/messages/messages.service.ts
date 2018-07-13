import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

import { Message } from './message.model';
import { Subject } from '../../../node_modules/rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messagesChanged= new Subject<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: Http) {
    this.initMessages();
  }

  initMessages() {
    this.http.get('https://cit-366-cms.firebaseio.com/messages.json')
      .pipe(map(
        (response: Response) => {
          const data: Message[] = response.json();
          console.log(data);
          return data;
        }
      )).subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messagesChanged.next(this.messages.slice());
        }
      );
  }

  storeMessages() {
    const headers = new Headers({'Content-Type': 'application/json'});
    this.http.put('https://cit-366-cms.firebaseio.com/messages.json', JSON.stringify(this.messages), {headers: headers})
      .subscribe(
        () => {
          this.messagesChanged.next(this.messages.slice());
        }
      );
  }

  getMessage(id: string) {
    this.messages.forEach(message => {
      if (message.id === id) {
        return message;
      }
    });
    return null;
  }

  getMessages() {
    return this.messages.slice();
  }

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach(function(message) {
      let currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    })
    return maxId;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }

}

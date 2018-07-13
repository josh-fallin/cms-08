import { Component, OnInit, Input } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

import { Message } from '../../message.model';
import { ContactsService } from '../../../contacts/contacts.service';
import { Contact } from '../../../contacts/contact.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  canEdit: boolean = false;
  messageSender: string = '';

  constructor(private contactsService: ContactsService, private http: Http) { }

  ngOnInit() {
    // works but it is very slow -> need to find a better option
    this.http.get('https://cit-366-cms.firebaseio.com/contacts.json')
    .pipe(map(
      (response: Response) => {
        const data: Contact[] = response.json();
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === this.message.sender) {
            return data[i].name;
          }
        }
        return null;
      }
    )).subscribe(
      (name: string) => {
        this.messageSender = name;
      }
    );
  }

}

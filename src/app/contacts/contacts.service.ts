import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  contactListChanged = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;

  constructor(private http: Http) {
    this.initContacts();
  }

  initContacts() {
    this.http.get('https://cit-366-cms.firebaseio.com/contacts.json')
    .pipe(map(
      (response: Response) => {
        const data: Contact[] = response.json();
        return data;
      }
    )).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contactListChanged.next(this.contacts.slice());
      }
    );
  }

  storeContacts() {
    const headers = new Headers({'Content-Type': 'application/json'});
    this.http.put('https://cit-366-cms.firebaseio.com/contacts.json', JSON.stringify(this.contacts), {headers: headers})
      .subscribe(
        () => {
          this.contactListChanged.next(this.contacts.slice());
        }
      );
  }

  getContact(id: string) 
  {
    for(let i = 0; i < this.contacts.length; i++) {
      if(this.contacts[i].id === id) {
        return this.contacts[i];
      }
    }
    return null;
  }

  getContacts() {
    return this.contacts.slice();
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(function(contact) {
      let currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    })
    return maxId;
  }

  addContact(contact: Contact) {
    if (contact == null) {
      return;
    }
    this.maxContactId++;
    contact.id = '' + this.maxContactId;
    this.contacts.push(contact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, updatedContact: Contact) {
    if (originalContact === null || updatedContact === null) {
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    updatedContact.id = originalContact.id;
    this.contacts[pos] = updatedContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (contact === null) { return; }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) { return; }

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';


@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact = new Contact('', '', '', '', '', []);
  groupContacts: Contact[] = [];
  invalidGroupContact: boolean = false;
  editMode: boolean = false;
  hasGroup: boolean = false;
  id: string;

  constructor(private contactsService: ContactsService, 
    private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        if (!params['id']) {
          this.editMode = false;
          return;
        }
        this.originalContact = this.contactsService.getContact(this.id);
        if (!this.originalContact) {
          return;
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
        if (this.originalContact.group) {
          this.hasGroup = true;
          this.groupContacts = this.originalContact.group.slice();
        }
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(null, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
    if (this.editMode === true) {
      this.contactsService.updateContact(this.originalContact, newContact);
    } else {
      this.contactsService.addContact(newContact);
    }
    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      console.log('invalid contact');
      return true;
    }
    if (newContact.id === this.contact.id) {
      console.log('invalid contact');
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        console.log('invalid contact');
        return true;
      }
    }
    console.log('valid contact');
    return false;
  }

  addToGroup($event: any) {
    let selectedContact: Contact = $event.dragData;
    this.invalidGroupContact = this.isInvalidContact(selectedContact);
    if (this.invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
    this.invalidGroupContact = false;
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }

    this.groupContacts.splice(index, 1);
    this.invalidGroupContact = false;
  }

}

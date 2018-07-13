import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';



@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  contact: Contact;
  contactGroup: Contact[] = [];
  id: string;


  constructor(private contactsService: ContactsService, private route: ActivatedRoute, 
    private router: Router) {}

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.contact = this.contactsService.getContact(this.id);
        if (this.contact.group) {
          this.contactGroup = this.contact.group;
        }
      }
    );
  }

  onDelete() {
    this.contactsService.deleteContact(this.contact);
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}

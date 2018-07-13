import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contacts/contact.model';

@Pipe({
  name: 'contactsFilter',
  pure: false
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): any {
    let filteredArray: Contact[] = [];

    if (term === '' || term === null) {
      return contacts;
    }

    filteredArray = contacts.filter(
      (contact: any) => contact.name.toLowerCase().includes(term.toLowerCase())
    );

    if (filteredArray.length < 1) {
      return contacts;
    }
    return filteredArray;
  }
}

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documentListChanged = new Subject<Document[]>();
  startedEditing = new Subject<number>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: Http) {
    this.initDocuments();
  }

  initDocuments() {
    this.http.get('https://cit-366-cms.firebaseio.com/documents.json')
      .pipe(map(
        (response: Response) => {
          const data: Document[] = response.json();
          return data;
        }
      )).subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documentListChanged.next(this.documents.slice());
        }
      );
  }

  storeDocuments() {
    const headers = new Headers({'Content-Type': 'application/json'});
    this.http.put('https://cit-366-cms.firebaseio.com/documents.json', JSON.stringify(this.documents), {headers: headers})
      .subscribe(
        () => {
          this.documentListChanged.next(this.documents.slice());
        }
      );
  }

  getDocument(id: string) {
    for (let i = 0; i < this.documents.length; i++)
    {
      if (this.documents[i].id === id) {
        return this.documents[i];
      }
    }
    return null;
  }

  getDocuments() {
    return this.documents.slice();
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach(function(document) {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    })
    return maxId;
  }

  addDocument(document: Document) {
    if (document == null) {
      return;
    }
    this.maxDocumentId++;
    document.id = '' + this.maxDocumentId;
    this.documents.push(document);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, updatedDocument: Document) {
    if (originalDocument == null || updatedDocument == null) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    updatedDocument.id = originalDocument.id;
    this.documents[pos] = updatedDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (document === null) { return; }

    const pos = this.documents.indexOf(document);
    if (pos < 0) { return; }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
  
}

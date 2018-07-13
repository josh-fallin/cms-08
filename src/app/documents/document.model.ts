import { Injectable } from "@angular/core";

@Injectable()
export class Document {
  public description: string = '';
  constructor(
    public id: string,
    public name: string,
    public url: string,
    public children: Document[]
  ) {}
}
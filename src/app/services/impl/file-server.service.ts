import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEventType, HttpResponse,} from '@angular/common/http';
import {RequestOptions, Request, RequestMethod, Headers, ResponseContentType, ResponseType} from '@angular/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import { Subject } from 'rxjs/Subject';
import {Response, UploadResponse} from '../../models';

@Injectable({
  providedIn: 'root',
})

export class FileServerService {

  private apiEndpoint: string;  

  private httpHeaders = new HttpHeaders({'Content-Type': 'multipart/form-data'});
  constructor(public http: HttpClient) {
    this.apiEndpoint = environment.serviceFileServerEndPoint;
  }
 
  deleteFile(path: string) {
    return this.http.delete(path);
  }

  deleteFiles(lista: Array<string>) {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: lista
    };
    return this.http.delete(this.apiEndpoint+"/", httpOptions);
  }

  uploadFile(file: HTMLInputElement, path: string) {
    const status = {};
    const formData: FormData = new FormData();
    formData.append('file', file.files[0], file.files[0].name);
    const urlstring = `${this.apiEndpoint}/${path}`;
    const req = new HttpRequest('PUT', urlstring, formData,  {
      reportProgress: true
    });
    const progress = new Subject<number>();
    const data = new Subject<UploadResponse>();
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          data.next(<UploadResponse>(event.body));
          progress.complete();
          data.complete();
        }
    });
    status[file.name] = {
      progress: progress.asObservable()
    };
    return data;
  }
}

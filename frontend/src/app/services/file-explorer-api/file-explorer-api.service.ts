import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileExplorerApiService {

  constructor(private httpClient: HttpClient) {
  }

  loadInput() {
    return this.httpClient.get('file-explorer/input');
  }

  loadOutput() {
    return this.httpClient.get('file-explorer/output');
  }

}

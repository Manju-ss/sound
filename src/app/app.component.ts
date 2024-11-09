import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AudiosoundComponent } from './audiosound/audiosound.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule, AudiosoundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'audio-sound-app';
}

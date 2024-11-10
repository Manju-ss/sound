import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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

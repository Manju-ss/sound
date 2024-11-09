import {  HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-audiosound',
  standalone: true,
  imports: [],
  templateUrl: './audiosound.component.html',
  styleUrl: './audiosound.component.css'
})
export class AudiosoundComponent {
  private mediaRecorder: MediaRecorder| null = null;
    audioChunks: Blob[] = [];
  recording = false;

   constructor(private httpClient:HttpClient){

  }

  startRecording() {
    this.audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.recording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        // this.audioUrl = URL.createObjectURL(audioBlob);
        console.log("SENT TO API")
        this.sendAudioToBackend(audioBlob);
        
      };
    });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.recording = false;
    } else {
      console.error('MediaRecorder is not initialized');
    }
  }
 
  sendAudioToBackend(audioBlob: Blob) {
    const options = {
        referrerPolicy: 'no-referrer' as const // Or 'origin' if only the origin should be sent
      };
    const formData = new FormData();
    const currentTime = new Date().toISOString().replace(/[:.-]/g, '_'); // Get current time formatted for a filename
    // const uniqueFileName = correlationId+'_audio.wav'; // Create a unique filename with the correlation ID
    formData.append('file', audioBlob, currentTime+'_audio.wav');  // Append audio file to FormData
    formData.append('header',options.referrerPolicy);
this.httpClient.post('http://13.201.194.81:8080/api/Sound',formData)
.subscribe({
  next: (response) => console.log('File sent successfully', response),
  error: (error) => console.error('send error', error),
  complete: () => console.log('Sent complete')
})
  }
  upload(){
    this.httpClient.get("http://13.201.194.81:8080/upload").subscribe({
        next: (response) => console.log('File uploaded successfully', response),
        error: (error) => console.error('Upload error', error),
        complete: () => console.log('Upload complete')
    })
  }
}
function uuidv4() {
    throw new Error('Function not implemented.');
}


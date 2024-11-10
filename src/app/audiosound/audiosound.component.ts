import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NetworkStatusService } from '../service/networkstatus';

@Component({
  selector: 'app-audiosound',
  standalone: true,
  imports: [],
  templateUrl: './audiosound.component.html',
  styleUrl: './audiosound.component.css'
})
export class AudiosoundComponent implements OnInit {
  @ViewChild('startButton', { static: true }) startButton!: ElementRef<HTMLButtonElement>;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordedData = {}
  private isoffline:boolean = false;

  recording = false;
  private hasRefreshed = false; // Track refresh status
  constructor(private httpClient: HttpClient, private ngZone: NgZone) {

  }
  ngOnInit(): void {
    if (navigator.onLine) {
      this.startRecording();
    }
    window.addEventListener('online', () => this.startRecording());
    window.addEventListener('offline', () => this.stopRecording());
  }

  private initNetworkListener() {

  }

  //   private onNetworkChange() {
  //     if (!this.hasRefreshed) {  // Only refresh once
  //       this.hasRefreshed = true;  // Set the flag to true to prevent multiple refreshes
  //       this.ngZone.run(() => {
  //         location.reload();
  //         // this.startButton.nativeElement.click();
  //         this.startRecording();
  //       });
  //     }
  //   }

  startRecording() {
    this.stopAndStartEvery30min();
    this.audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      console.log("Started the recording");
      // this.recording = true;
      this.mediaRecorder.start();


      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        // this.audioUrl = URL.createObjectURL(audioBlob);
        console.log("SENT TO API")
        this.sendAudioToBackend(audioBlob);
        setTimeout(() => {
          location.reload();
          this.ngOnInit();
        }, 10000)

      };
    });
  }
  stopAndStartEvery30min() {
    this.recording = true;
    setTimeout(() => {

      this.stopRecording();
      this.recording = false;
    }, 1800000); // 30 * 60 * 1000 milliseconds
  }
  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      //   this.recording = false;
    } else {
      console.error('MediaRecorder is not initialized');
    }
  }


  // offlinedata() {
  //   if (this.isOffline) {
  //     console.log('Storing data locally due to offline mode');
  //     localStorage.setItem('recordedData', JSON.stringify(this.recordedData));
  //   }
  // }


  sendAudioToBackend(audioBlob: Blob) {
    const options = {
      referrerPolicy: 'no-referrer' as const // Or 'origin' if only the origin should be sent
    };
    const formData = new FormData();
    const currentTime = new Date().toISOString().replace(/[:.-]/g, '_'); // Get current time formatted for a filename
    // const uniqueFileName = correlationId+'_audio.wav'; // Create a unique filename with the correlation ID
    formData.append('file', audioBlob, currentTime + '_audio.wav');  // Append audio file to FormData
    formData.append('header', options.referrerPolicy);
    this.httpClient.post('http://13.201.194.81:8080/api/Sound', formData)
      .subscribe({
        next: (response: any) => console.log('File sent successfully', response),
        error: (error: any) => console.error('send error', error),
        complete: () => console.log('Sent complete')
      })
  }
  upload() {
    this.httpClient.get("http://13.201.194.81:8080/upload").subscribe({
      next: (response: any) => console.log('File uploaded successfully', response),
      error: (error: any) => console.error('Upload error', error),
      complete: () => console.log('Upload complete')
    })
  }


  isWithinTimeRange(): boolean {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Define time ranges
    const morningStart = { hours: 6, minutes: 0 };
    const morningEnd = { hours: 9, minutes: 0 };
    const eveningStart = { hours: 17, minutes: 0 };
    const eveningEnd = { hours: 22, minutes: 30 };

    // Check morning time range
    if (currentHours >= morningStart.hours && (currentHours < morningEnd.hours ||
      (currentHours === morningEnd.hours && currentMinutes <= morningEnd.minutes))) {
      return true;
    }

    // Check evening time range
    if (currentHours >= eveningStart.hours && (currentHours < eveningEnd.hours ||
      (currentHours === eveningEnd.hours && currentMinutes <= eveningEnd.minutes))) {
      return true;
    }

    return false;
  }

}


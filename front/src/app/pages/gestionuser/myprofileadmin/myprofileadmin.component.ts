import { Component, OnInit } from '@angular/core';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { User } from "../../../services/gestionUser/models/user";
import { Router } from '@angular/router';
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-myprofileadmin',
  templateUrl: './myprofileadmin.component.html',
  styleUrl: './myprofileadmin.component.scss'
})
export class MyprofileadminComponent implements OnInit {
  currentUser: User | null = null;
  currentUserId: number | null = null;
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;

  constructor(
      private currentuserService: CurrentuserService,
      private router: Router
  ) {}

  ngOnInit(): void {
    // Load user information when component initializes
    this.currentuserService.loadCurrentUser();

    // Subscribe to subjects to get information
    this.currentuserService.getCurrentUser().subscribe((user: User | null) => {
      this.currentUser = user;

      // Construct profile picture URL if available
      if (user && user.profilePicture) {
        this.imageUrl = `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
      }
    });

    this.currentuserService.getCurrentUserId().subscribe((id: number | null) => {
      this.currentUserId = id;
    });
  }

  // Logout functionality
  logout(): void {
    // Add your logout logic here
    console.log('Logout clicked');
  }

  // Handle image error
  handleImageError(): void {
    this.imageUrl = null;
  }
}
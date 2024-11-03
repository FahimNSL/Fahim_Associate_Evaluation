

# NSL R&D 

## Overview

This web application allows users to manage and store R&D reports effectively. It has two user roles: **Admin/Project Lead** and **Project Members**, each with specific functionalities. The application enables users to create, modify, and search for R&D reports, manage projects, and upload research papers.

## Features

### User Roles

#### Admin
- Login, logout, and change password
- Add, modify, and manage projects
- Add team members to projects and assign project leads
- Add and modify R&D reports
- Manage the list of research papers associated with R&D
- Search for previous R&D reports based on keywords
- View contribution history based on papers added by project members

#### Project Lead
- Login, logout, and change password
- Add, modify, and manage his assigned projects
- Add team members to his assigned projects
- Add and modify R&D reports
- Manage the list of research papers associated with R&D
- Search for previous R&D reports based on keywords
- View contribution history based on papers added by project members

#### Project Members
- Login, logout, and change password
- Add and modify R&D reports
- Manage research papers for specific R&D projects
- Search for previous R&D reports based on keywords

### R&D Report Attributes
- **Accuracy**
- **R&D Status**
- **File Upload**: Supports file uploads
- **Visual Representation**: Graphs for better insights

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: MongoDB

## Database Structure

### Collections

1. **User**
   - userType: String (Admin/ProjectLead, Member)
   - name: String
   - nslUniqueId: String

2. **R&D Project**
   - title: String
   - uniqueId: String
   - description: String
   - projectLead: String (User ID)
   - projectMembers: [String] (Array of User IDs)
   - projectReports: [String] (Array of Report IDs)
   - projectDuration: String

3. **Research Paper**
   - title: String
   - publishedYear: Number
   - relatedProjectId: String (R&D Project ID)
   - result: Object (e.g., { accuracy: Number, precision: Number })
   - datasetUsed: String

## Backend Setup

### Prerequisites
- Node.js
- MongoDB


## API Documentation
 -https://documenter.getpostman.com/view/38334049/2sAY4xBMnM


## Project Setup

### Installation

Install dependencies:
```bash
npm install
```

### Running the Project
Start the application:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Usage

1. Navigate to the login page and authenticate using your credentials.
2. Depending on your role, you can access various features to manage projects and reports.
3. Use the search functionality to find specific R&D project name and description.
4. Upload files for R&D reports and manage related research papers.

## Visual Representation
The application includes visual graphs  to represent contribution history and project reports effectively.


## Admin credentials
   email: fahim@nsl1.com
   password: 123456

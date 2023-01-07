# iamAssignment3

your ownership: 
authentication - who can access 
authorization - what can access, 
account and user profile
internal admin dashboard - moved from the BO


account - a group of one or more users
has one or more users (depends on his Billing plan)
account can access features according to his Billing plan
account life cycle: none → active → suspended → closed
account must have a super privileges user (admin) 


user - part of the account
admin can invite or add another user to his account
we require 2FA (two factors authentication)
we support Google/ Github and username & password login
we use JWT to secure our API calls
IAM provides internal authentication service as a proxy for other teams 
(example: user → api-key → core → i-a-m → no/go)
we support common user events email notification (upon any account status change)



## Description
Identity & Access Management system stands at the entrance to an a/b tests system.
The service will support:
<br>Authentication and authorization.
<br>Account and user profile.
<br>Internal admin dashboards- access only for admin users.
<br>registration, login, forgot password and actions on users (suspension, edit details and more).
<br>The service is using Google API to allow login in with gmail.
<br>Users sessions and permission are managed by JWT.
<br>Data is stored on Mongo Atlas cloud.

## Flow
1.  Login or registration.
    registration will demend authentication by email with verification code.
    after registration you will be asked to log in.
2.  Information and features will be displayed according to user type:
    * admin- internal system permissions: CRUD on all users and accounts in the system, and their properties. 
      - all users
      - all accounts
      - profile
    * manager- account permissions: CRUD on all properties (and users) of account.
    * user- user permissions: CRUD only on it own properties.

## FYIs:
* passwords and codes sent to email can end up in the spam folder
* api requests that contain body in postman should be formatted as JSON
* admin users do not have accounts by definition
* account name will be define by the user's email that created it
* 
* growth directory belongs to growth team. we use their api to send confirm registration mail and suspention announcement mail
* our logo is SORT - stands for the capital letters of each of our last names. we are the IAM band :fox_face:
## Prerequisites
```bash
  Node.js 16v
```
## Run with render
```bash
  https://iam-team.onrender.com
```
## Local run
### Install
```bash
  npm install
```
### Start server
```bash
  npm start
```
### Start client
```bash
type in url borwser: http://localhost:5000 
```
### Other dependancies
```bash
  create .env file with secrets that will pass by demand 
```
## API documantion
```bash
https://documenter.getpostman.com/view/24057770/2s8YzTTMkM
```
## Built with
* nodejs
* express
* mongoose
* Google API
* javascript
* html
* css

## Credits
* Roey Ben Harush :ring:
* Racheli Dekel :roll_eyes:
* Shahar Ariel :guitar:
* Tomer Duchovni 	:soccer:
* Roni Naor :socks:
* Ofir Peleg :tomato:

## Lecturer
David Avigad :lollipop:

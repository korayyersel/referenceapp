# Reference - App

Following example implementations can be found here:

- [x] 1) Auto-Increment ID
- [x] 2) Virtual Tables (SDI)
- [x] 3) Job Scheduling
- [x] 4) Replication of Virtual Tables (flowgraph, db procedure, job scheduler)
- [x] 5) node.js OData Service (Read)
- [x] 6) node.js REST Service (Write - Import CSV)
- [x] 7) Java REST Service
- [x] 8) Authentication (xsuaa)
- [x] 9) Authorisation - API/Service (Scope Check)
- [ ] 10) Authorisation - Data (AccessPolicy / cds)


## Known Issues:
- [x] csrfProtection temporarly switched off
- [x] Refactor csvImport code, make a separat class with the code from server.js

## 1) Auto-Increment ID
### Relevant Files
- MY_BOOKSHOP_BOOKS.hdbcds
### SQL Insert with Auto-Increment ID:
```sql
INSERT INTO "REFERENCEDEMO"."MY_BOOKSHOP_BOOKS" (TITLE, STOCK) VALUES(
	'third book',
	7676
);
```

## 2) Virtual Tables (SDI)
### Relevant Files
- User Provided Service from Cockpit
- mta.yaml (ups resource)
- remote.hdbgrants
- VT_ZPI_BI_MPM_FIN.hdbvirtualtable
- VT_PA0002.hdbvirtualtable
- VT_ZPI_BI_MPM_FIN.hdbvirtualtable

## 3) Job Scheduling
TODO
inkl. xs-security.json
To configure XSUAA support, please update your service instance from SAP Cloud Platform Cockpit or using the command (cf update-service referenceapp-jobscheduler -c '{"enable-xsuaa-support": true }') and restage the application bound to this service instance.

## 4) Replication of Virtual Tables (flowgraph, db procedure, job scheduler)
TODO 

## 5) node.js OData Service (Read)
### Relevant Files
- CATALOGSERVICE_BOOKS.hdbcds (db)
- csn.json (srv)
- package.json (srv)
- server.js (srv)

## 6) node.js REST Service (Write - Import CSV)
### Relevant Files
TODO fix relevant files
- server.js (srv)
```javascript
app.post("/csvImport/Books", upload.single("file"), function (req, res) {
 ...
}
```

### Example csv for UI5 Upload
```csv
title;stock
Book 1;3782
Book 2;646
Book 3;4783
```
### Native JavaScript call example for UI5 Upload
- First fetch Token
```javascript
var xhr = new XMLHttpRequest();
var url = [ui5appurl];
xhr.open("GET", url);
xhr.setRequestHeader("X-CSRF-Token", "Fetch");
xhr.send();
```
- Call import service with token
```javascript
var data = new FormData();
var fileBase64Binary = "dGl0bGU7c3RvY2sNCkJvb2sgMTszNzgyDQpCb29rIDI7NjQ2DQpCb29rIDM7NDc4Mw=="; // see above example csv
var blob = atob(fileBase64Binary);
var file = new File([blob], "test.csv");
data.append("file", file);
var xhr = new XMLHttpRequest();
var base = [ui5appurl];
xhr.open("POST", base + "/csvImport/Books");
xhr.setRequestHeader("X-CSRF-Token", [token]); // take the token from the response of fetch token call
xhr.send(data);
```
## 7) Java REST Service
TODO

## 8) Authentication (xsuaa)
TODO

## 9) Authorisation - API/Service (Scope Check)
TODO

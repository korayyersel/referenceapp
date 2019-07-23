# Reference - App

Following example implementations can be found here:

- [x] Auto-Increment ID
- [x] Virtual Tables (SDI)
- [ ] Replication of Virtual Tables (flowgraph, db procedure, job scheduler)
- [x] node.js OData Service (Read)
- [x] node.js REST Service (Write - Import CSV)
- [ ] Java REST Service (Write - Import CSV)
- [x] Authentication (xsuaa)
- [ ] Authorisation - API/Service (Scope Check)
- [ ] Authorisation - Data (AccessPolicy / cds)

## Known Issues:
- none

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

## 4) node.js OData Service (Read)
### Relevant Files
- CATALOGSERVICE_BOOKS.hdbcds (db)
- csn.json (srv)
- package.json (srv)
- server.js (srv)

## 5) node.js REST Service (Write - Import CSV)
### Relevant Files
- server.js (srv)
```javascript
app.post("/csvImport/Books", upload.single("file"), function (req, res) {
 ...
}
```

### Example csv for UI5
```csv
title;stock
Book 1;3782
Book 2;646
Book 3;4783
```
### Native JavaScript call example for UI5
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

# Reference - App

Following example implementations can be found here:

- [x] Auto-Increment ID
- [x] Virtual Tables (SDI)
- [ ] Replication of Virtual Tables (SDI)
- [x] node.js OData Service (Read)
- [x] node.js REST Service (Write - Import CSV)
- [ ] Java REST Service (Write - Import CSV)
- [ ] Authentication (xsuaa)
- [ ] Authorisation (AccessPolicy / cds)


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

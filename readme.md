# Reference - App

Following example implementations can be found here:

- [x] Auto-Increment ID
- [x] Virtual Tables (SDI)
- [ ] Replication of Virtual Tables (SDI)
- [x] OData Service (Read)
- [ ] node.js Service (Write)
- [ ] Authentication (xsuaa)
- [ ] Authorisation (AccessPolicy / cds)


## 1) Auto-Increment ID
### Relavent Files
- MY_BOOKSHOP_BOOKS.hdbcds
### SQL Insert with Auto-Increment ID:
```sql
INSERT INTO "REFERENCEDEMO"."MY_BOOKSHOP_BOOKS" (TITLE, STOCK) VALUES(
	'third book',
	7676
);
```

## 2) Virtual Tables (SDI)
### Relavent Files
- User Provided Service from Cockpit
- mta.yaml (ups resource)
- remote.hdbgrants
- VT_ZPI_BI_MPM_FIN.hdbvirtualtable
- VT_PA0002.hdbvirtualtable
- VT_ZPI_BI_MPM_FIN.hdbvirtualtable

## 4) OData Service (Read)
### Relavent Files
- CATALOGSERVICE_BOOKS.hdbcds (db)
- csn.json (srv)
- package.json (srv)

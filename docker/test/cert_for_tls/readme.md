this cers are generated and only used for test purpose
they contains no data
```bash

openssl req -x509 -newkey rsa:4096 \                                                                                                                                  ─╯
-nodes -keyout key.pem -out cert.pem \
-sha256 -days 3650 \
-addext "subjectAltName = DNS:farm-mailpit"

```


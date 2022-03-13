openssl req -x509 -out orchard-tools.local.crt -keyout orchard-tools.local \
  -newkey rsa:2048 -nodes -sha256 -subj '/CN=orchard-tools.local' \
  -extensions EXT -config <( printf "[dn]\nCN=orchard-tools.local\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:orchard-tools.local\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

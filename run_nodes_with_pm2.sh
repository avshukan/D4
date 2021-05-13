#!/bin/bash

NODE_TYPE=main PORT=3000 pm2 start bin/www --name=main 
NODE_TYPE=refbook PORT=3001 pm2 start bin/www --name=refbook_01 
NODE_TYPE=refbook PORT=3002 pm2 start bin/www --name=refbook_02
NODE_TYPE=patients PORT=3003 pm2 start bin/www --name=patients

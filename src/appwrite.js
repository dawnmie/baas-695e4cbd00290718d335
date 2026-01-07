import { Client, Account, Databases, Query } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://appbuild.space/v1')
  .setProject('695e4cbd00290718d335');

export const account = new Account(client);
export const databases = new Databases(client);
export { client, Query };

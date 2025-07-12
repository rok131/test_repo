export const store = {
  // Users are objects {id, email, password, profile, balance, history}
  users: [],
  // token -> userId
  sessions: {},
  // Parties are objects {id, name, deposit, serviceName, startDate, owner, members, deposits}
  parties: [],
  nextUserId: 1,
  nextPartyId: 1
};

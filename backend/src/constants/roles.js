const ROLES = Object.freeze({
  APPLICANT: 'applicant',
  VERIFIER: 'verifier',
  APPROVER: 'approver',
});

const ALL_ROLES = Object.freeze(Object.values(ROLES));

module.exports = { ROLES, ALL_ROLES };

async function verifyExpiringDate(expiring_date: Date): Promise<boolean> {
  const now = new Date(Date.now());
  return expiring_date > now;
}

async function isValidDocumentType(type: string): Promise<boolean> {
  return type === 'NATIONAL_ID_CARD';
}

async function validateAge(dob: Date): Promise<boolean> {
  const now = new Date(Date.now());

  const todayYear = now.getFullYear();
  const dayOfBirthYear = dob.getFullYear();
  const isValid = todayYear - dayOfBirthYear;
  return isValid > 19;
}

async function checkAML(userDetails: any, dob: Date) {
  console.log(`Searching ${userDetails} dob: ${dob} in Public AML Lists ...`);
}

async function checkPEP(userDetails: any, dob: Date) {
  console.log(`Searching for ${userDetails} dob: ${dob} in Public AML Lists ...`);
}
async function downloadDocument(url: string) {
  console.log(`Downloading file from ${url} `);
}

export { validateAge, checkPEP, checkAML, downloadDocument, isValidDocumentType, verifyExpiringDate };

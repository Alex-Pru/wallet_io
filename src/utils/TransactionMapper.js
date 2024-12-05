const transactionMap = {
  creditCardId: "credit_card_id",
  categoryId: "category_id",
  walletId: "wallet_id",
  type: "type",
  amount: "amount",
  title: "title",
  description: "description",
  date: "date",
  installments: "installments",
  currentInstallment: "current_installment",
  createdAt: "created_at",
  userId: "user_id",
};

const transactionMapper = (inputObject) => {
  const mappedFields = {};
  for (const key in inputObject) {
    if (transactionMap[key]) {
      mappedFields[transactionMap[key]] = inputObject[key];
    }
  }
  return mappedFields;
};

export default transactionMapper;

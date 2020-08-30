/**
 * Class used to assist with working with Transaction objects on the frontend
 */
 class TxHelper {
    _logger;

    constructor(logger) {
        this._logger = logger;
    }

    /**
     * Prepares the provided transactions to be handled by the frontend
     * @param {Array} txList array of Transactions to be massaged
     */
    massageTransactions(txList) {
        if (typeof(txList) !== 'undefined') {
            txList.forEach(transaction => {
                transaction.date = new Date(transaction.date)
            });

            txList.sort(this._compareTx);
        }

        this._calculateBalance(txList);

        return txList;
    }

    /**
     * Method used to compare two transactions for the purposes of ordering
     * @param {Transaction} a the first transaction to be compared
     * @param {Transaction} b The second transaction to be compared
     */
    _compareTx(a, b) {
        if (a.date < b.date) {
            return -1;
        }
        else if (b.date < a.date) {
            return 1;
        }

        return 0;
    }

    /**
     * Calculates the balance for each transaction of the provided sorted list
     * @param {Array} txList array of Transaction objects
     */
    _calculateBalance(txList) {
        let currentBalance = 0;
        txList.forEach(transaction => {
            currentBalance += transaction.amount;
            transaction.balance = currentBalance;
        });
    }
 }

 export default TxHelper;
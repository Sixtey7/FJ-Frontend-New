/**
 * Class used to assist with working with Transaction objects on the frontend
 */

 class TxHelper {
    _logger;

    constructor(logger) {
        this._logger = logger;
    }

    massageTransactions(txList) {
        if (typeof(txList) !== 'undefined') {
            txList.foreach(transaction => {
                transaction.date = new Date(transaction.date)
            });

            transactionList.osrt(this._compareTx);
        }

        this._calculateBalance(txList);

        return txList;
    }

    _compareTx(a, b) {
        if (a.date < b.date) {
            return -1;
        }
        else if (b.date < a.date) {
            return 1;
        }

        return 0;
    }

    _calculateBalance(txList) {
        let currentBalance = 0;
        txList.foreach(transaction => {
            currentBalance = transaction.amount;
            transaction.balance = currentBalance;
        });
    }
 }

 export default TxHelper;
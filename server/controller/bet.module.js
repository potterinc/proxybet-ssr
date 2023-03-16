const { Bets, BettingSlip } = require('../model/betslip.model')
const { Wallet } = require('../model/wallet.model')

// View all bets
const viewBets = async (req, res) => {
  try {
    const betHistory = await Bets.find({ userID: req.bearer.payload._id },
      { stake: 1, betDate: 1, gameSlip: 1 })

      .then(history => {
        let sumOfOdds = []
        let sum = 0;
        
        history.forEach((slip, i) => {
          BettingSlip.find(slip.gameSlip)
            .then(data => {
             let sumOdds = function() {
                let matches = data.games;
                matches.forEach(odd => {
                  sum += odd.odds;
                })
                sumOfOdds.push(sum)
                console.log(sumOfOdds);
                return sumOfOdds;
              }
              
              res.status(200).render('view-bets', {
                betTicket: data,
                betHistory: history,
                mDate: data.dateIssued.toDateString(),
                totalOdds: sumOdds()
              })
            })
            .catch(err => {

            })
        })
      })

    // query betslip status

    // BettingSlip.findOne(betHistory.gameSlip)
    //   .then(data => {
    //     res.status(200).render('view-bets', {
    //       betTicket: data,
    //       betHistory,
    //       mDate: '',
    //       // totalOdds: TOTAL_ODDS(data)
    //     })
    //     console.log(betHistory.gameSlip);
    //   })
  } catch (e) {
    res.status(500).json({
      message: e.message
    })
  }
}

// Place a bet
const placeBet = async (req, res) => {
  const games = new Bets({
    userID: req.bearer.payload._id,
    stake: parseInt(req.body.stake),
    gameSlip: req.body.gameSlip
  })

  try {
    const walletBalance = await Wallet.find({ userID: games.userID }, {
      balance: 1
    })
    if (games.stake > walletBalance.balance) {
      res.status(400).json({
        status: false,
        message: "ERROR: Insufficient funds",
      })
      return
    }
    else {
      let newBalance = games.stake
      res.status(201).json({
        status: true,
        message: "OK: Bet Placed!",
      })
    }
    /**
     * Get wallet balance
     * Check if user has sufficent balance to place bet?
     *  Substract stake from balance
     *  update new wallet balance
       * else:send 400 insufficent balance
       */

    games.save()
      .catch(err => {
        res.status(400).json({
          status: false,
          message: err.message
        })
      })
  } catch (e) {
    res.status(500).json({
      message: e.message
    })
  }
}

// Update Game slip
const updateGameSlip = async (req, res) => {
  try {
    const previousGameSlip = await Bets.find({ _id: req.body._id });
    const previousStake = previousGameSlip.stake;
    const currentStake = parseInt(req.body.stake);

    const balanceStake = currentStake - previousStake
    /**
     * Get wallet balance
     * check if user has sufficinet funds?
     *   Wallet balance + balanceStake
     *   update wallet balance
     *  else: send 401 status code: Insufficient balance
     */

  }
  catch (e) {
    res.status(501).json({
      status: false,
      message: e.message
    })
  }
}

// Cancel a bet
const cancelBet = async (req, res) => {
  try {
    await Bets.findOneAndDelete({ _id: req.body._id })

    /**
     * Refund stake
     */

  } catch (e) {
    res.status(501).json({
      status: false,
      message: e.message
    })
  }
}

// Generate bet slip
const newTicketSlip = async (req, res) => {
  const slip = new BettingSlip({
    games: req.body.matches, // Array of objects
    userStakeLimit: req.body.stakeLimit,
    maximumStake: req.body.maxStake
  })
  try {
    await slip.save()
      .then(data => {
        res.status(401).json({
          status: true,
          message: "Ticket Generated"
        })
      })
      .catch(err => {
        res.status(500).json({
          status: false,
          message: err.message
        })
      })
  }
  catch (e) {

  }
}

// View all bet ticket
const viewAllTickets = async (req, res) => {
  try {

    await BettingSlip.find()
      .then(data => {
        res.status(200).render('view-ticket', {
          tickets: data,
          totalOdds: TOTAL_ODDS(data),
        })
      })

  } catch (e) {
    res.status(500).json({
      status: false,
      message: e.message
    })
  }
}

/**
 * Sum Match odds
 * 
 * @param {object | ArrayBuffer} data 
 * @returns Number
 */
const TOTAL_ODDS = data => {
  let sum = 0;
  let totalOdds = [];
  data.forEach(slip => {

    slip.games.forEach(game => {
      sum += game.odds
    })
    totalOdds.push(sum)

  });
  return totalOdds
}

module.exports = {
  ticketSlip: newTicketSlip,
  ViewTickets: viewAllTickets,
  viewBets,
  placeBet,
  updateGameSlip,
  cancelBet
}
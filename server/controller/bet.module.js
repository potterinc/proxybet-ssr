const { Bets, BettingSlip } = require('../model/betslip.model')
const { Wallet } = require('../model/wallet.model')

// View all bets by a user
const viewBets = async (req, res) => {
  try {
    await Bets.find({ userID: req.bearer.payload._id },
      { stake: 1, betDate: 1, gameSlip: 1 })
      .populate('gameSlip')
      .exec(function (err, history) {
        if (err) return handleError;
        res.status(200).render('view-bets', {
          betHistory: history
        })
      })

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
    await Wallet.findOne({ userID: games.userID }, {
      balance: 1, _id: 1
    }).then(wallet => {
      let newBalance = wallet.balance - games.stake
      
      if (newBalance < 0) {
        throw Error
      }
      else {
        Wallet.findByIdAndUpdate(wallet._id, { balance: newBalance }).exec()
        res.status(201).json({
          status: true,
          message: "OK: Bet Placed!",
        })
      }
    }).catch(e => {
      res.status(402).json({
        message: 'Insufficient funds!'
      })

    })

    games.save()

  } catch (e) {
    res.status(500).json({
      status: false,
      message: err.message
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

// View all bet tickets for admin
const viewAllTickets = async (req, res) => {
  try {
    if(req.bearer.payload.role != 'Admin'){
      res.status(403).json({
        status:false,
        message: "FORBIDDEN: You\'re not an Admin"
      })
    }
      
    await BettingSlip.find()
      .then(games => {
        res.status(200).render('view-ticket', {
          BetSlip: games,
        })
      })

  } catch (e) {
    res.status(500).json({
      status: false,
      message: e.message
    })
  }
}

module.exports = {
  ticketSlip: newTicketSlip,
  ViewAdminTickets: viewAllTickets,
  viewBets,
  placeBet,
  updateGameSlip,
  cancelBet
}
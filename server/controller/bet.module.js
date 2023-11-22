const { Bets, BettingSlip } = require('../model/betslip.model')
const { Transactions } = require('../model/transaction.model')
const User = require('../model/user.model.js')

// View all bets by a user
const viewBets = async (req, res) => {
  try {
    await Bets.find({ user: req.bearer.payload._id },
      { stake: 1, betDate: 1, gameSlip: 1 })
      .populate('gameSlip')
      .sort({ createdAt: -1 })
      .exec(function (err, history) {
        if (history == '') {
          res.send('<small>You have not placed any bet</small>')
        } else {
          res.status(200).render('view-bets', {
            betHistory: history
          })
        }
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
    user: req.bearer.payload._id,
    stake: parseInt(req.body.stake),
    gameSlip: req.body.gameSlip
  })

  try {

    if (games.gameSlip === undefined)
      return res.status(400).json({ message: 'Slip not found' })

    // Get wallet balance
    const user = await User.findById(games.user, {
      walletBalance: 1
    }).exec();

    let newBalance = parseInt(user.walletBalance) - parseInt(games.stake)

    // Validating minimum stake
    if (games.stake < 100) {
      return res.status(400).json({
        message: 'Minimum stake is NGN100'
      })
    }
    // Validating if balance is sufficient
    else if (newBalance < 0) {
      console.log()
      return res.status(406).json({
        message: 'Insufficient funds!'
      });
    }
    else {

      // Update wallet balance
      await User.findByIdAndUpdate(user._id, {
        $set: { walletBalance: newBalance }
      }, { runValidators: true })
        .then(() => {
          games.save()
          return res.status(201).json({
            status: true,
            message: "OK: Bet Placed!",
          })
        })
        .catch(e => {
          if (e.name = 'validationError') {
            if (e.error.errors['stake']) {
              return res.status(400).json({
                status: false,
                message: e.error.errors['stake'].message
              });
            }
          }
        })
    }

  } catch (e) {
    res.status(500).json({
      status: false,
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
    maximumStake: req.body.maxStake,
    totalOdds: req.body.totalOdds,
    ticketBonus: req.body.ticketBonus
  })
  try {
    if (req.bearer.payload.role == 'Admin') {
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
    } else
      throw Error;
  }
  catch (e) {
    res.status(403).json({
      status: false,
      message: `Unauthorized access`
    })
  }
}

// View all bet tickets for admin
const viewAllTickets = async (req, res) => {
  try {

    await BettingSlip.find()
      .then(games => {
        if (games == '') {
          res.send('<small>Tickets unavailable</small>')
        } else {
          res.status(200).render('view-ticket', {
            BetSlip: games,
          })
        }
      })

  } catch (e) {
    res.status(500).json({
      status: false,
      message: e.message
    })
  }
}

// View one ticket
const getOneGameSlip = async (req, res) => {
  try {
    await BettingSlip.findById(req.params.id, {
      maximumStake: 1,
      totalOdds: 1,
      ticketBonus: 1
    })
      .then(slip => {
        res.status(200).json({
          slip
        })
      })

  } catch (e) {
    res.status(501).json({
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
  cancelBet,
  getOneGameSlip
}
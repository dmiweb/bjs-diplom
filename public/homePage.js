const logoutBtn = new LogoutButton();

logoutBtn.action = () => {
  ApiConnector.logout(() => {
    location.reload();
  });
}

ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();

function exchangeRateRequest() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  })
}

exchangeRateRequest();

setInterval(() => {
  exchangeRateRequest();
}, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = data => {
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, 'Ваш баланс пополнен');
    } else {
      moneyManager.setMessage(!response.success, response.error);
    }
  });
}

moneyManager.conversionMoneyCallback = data => {
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, 'Конвертация прошла успешно');
    } else {
      moneyManager.setMessage(!response.success, response.error);
    }
  });
}

moneyManager.sendMoneyCallback = data => {
  ApiConnector.transferMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, 'Деньги отправлены пользователю');
    } else {
      moneyManager.setMessage(!response.success, response.error);
    }
  });
}

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

favoritesWidget.addUserCallback = data => {
  ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      moneyManager.setMessage(response.success, 'Пользователь добавлен в избранные');
    } else {
      moneyManager.setMessage(!response.success, response.error);
    }
  });
}

favoritesWidget.removeUserCallback = data => {
  ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      moneyManager.setMessage(response.success, 'Пользователь удален из избранных');
    } else {
      moneyManager.setMessage(!response.success, 'Ошибка удаления пользователя');
    }
  })
}
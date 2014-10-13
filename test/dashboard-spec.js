describe('dashboard', function() {
    var watchList = element(by.className('watch-list'));
    var tradeFeed = element(by.className('trade-feed'));
    var priceCharts = element.all(by.className('price-chart'));

    beforeEach(function() {
        browser.get('http://localhost:63342/dashboard');
    });

    afterEach(function() {
        browser.executeScript("window.localStorage.clear()");
    });

    it('should have 3 widgets', function() {
        expect(watchList.isDisplayed()).toBe(true);
        expect(tradeFeed.isDisplayed()).toBe(true);
        expect(priceCharts.count()).toBe(1);
    });

    it('should hide all widgets', function() {
        element(by.css('.settings-control')).click();
        element(by.css('.settings-dialog .watch-list-entry input:checked')).click();
        element(by.css('.settings-dialog .trade-feed-entry input:checked')).click();
        element(by.css('.settings-dialog .price-chart-entry input:checked')).click();
        element(by.css('.settings-dialog .save-button')).click();
        expect(watchList.isDisplayed()).toBe(false);
        expect(tradeFeed.isDisplayed()).toBe(false);
        expect(priceCharts.count()).toBe(0);
    });

     it('should hide all widgets after clicking close buttons', function() {
         element(by.css('.watch-list .header .controls .control.glyphicon-remove')).click();
         element(by.css('.trade-feed .header .controls .control.glyphicon-remove')).click();
         element(by.css('.price-chart .header .controls .control.glyphicon-remove')).click();
         expect(watchList.isDisplayed()).toBe(false);
         expect(tradeFeed.isDisplayed()).toBe(false);
         expect(priceCharts.count()).toBe(0);
     });

    it('should add entry to watch list', function() {
        element(by.css('.watch-list .controls .control.glyphicon-cog')).click();
        element(by.css('.twitter-typeahead input')).sendKeys('g');
        browser.wait(function() {
            return element(by.css('.twitter-typeahead .tt-dropdown-menu')).isDisplayed();
        }, 5000);
        element.all(by.css('.twitter-typeahead p')).then(function(els){
            els[0].click();
        });
        element(by.css('.settings-dialog .add-company-button')).click();
        element(by.css('.settings-dialog .save-button')).click();
        expect(element.all(by.css('.watch-list tbody tr')).count()).toBe(6);
    });

    it('should redirect to buy page', function() {
        element(by.css('.watch-list table .actions .buy')).click();
        expect(browser.getCurrentUrl()).toMatch(/#\/buy/);
    });

    it('should redirect to details page', function() {
        element(by.css('.watch-list table .actions .details')).click();
        expect(browser.getCurrentUrl()).toMatch(/#\/details/);
    });

    it('should add price chart from watch list', function() {
        expect(priceCharts.count()).toBe(1);
        element.all(by.css('.watch-list table .actions .chart')).get(1).click();
        expect(priceCharts.count()).toBe(2);
        element.all(by.css('.watch-list table .actions .chart')).get(1).click();
        expect(priceCharts.count()).toBe(2);
    });

    it('should should show all charts on single widget', function() {
        expect(priceCharts.count()).toBe(1);
        element.all(by.css('.watch-list table .actions .chart')).get(1).click();
        expect(priceCharts.count()).toBe(2);
        element(by.css('.watch-list .controls .control.glyphicon-cog')).click();
        element(by.css('.settings-dialog input:checked')).click();
        element(by.css('.settings-dialog .save-button')).click();
        expect(priceCharts.count()).toBe(1);
    });

    it('should should change rows arrangement in watch list', function() {
        var companyName = element.all(by.css('.watch-list table tbody tr:first-child td')).get(1).getText();
        expect(companyName).toBe('Apple Inc');
        element(by.css('.watch-list .header .controls .control.glyphicon-cog')).click();
        element(by.css('.settings-dialog table tbody tr:first-child .control.glyphicon-arrow-down')).click();
        element(by.css('.settings-dialog .save-button')).click();
        companyName = element.all(by.css('.watch-list table tbody tr:first-child td')).get(1).getText();
        expect(companyName).toBe('Google Inc');
    });

    it('should should change current company in chart and allow to add it again as second widget', function() {
        expect(priceCharts.count()).toBe(1);
        element(by.css('.price-chart .header .controls .control.glyphicon-cog')).click();
        element(by.css('.twitter-typeahead input')).clear().sendKeys('g');
        browser.wait(function() {
            return element(by.css('.twitter-typeahead .tt-dropdown-menu')).isDisplayed();
        }, 5000);
        element.all(by.css('.twitter-typeahead p')).then(function(els){
            els[0].click();
        });
        element(by.css('.settings-dialog .save-button')).click();
        element(by.css('.settings-dialog .header .control.glyphicon-remove')).click();
        element.all(by.css('.watch-list table .actions .chart')).get(0).click();
        expect(priceCharts.count()).toBe(2);
    });
});
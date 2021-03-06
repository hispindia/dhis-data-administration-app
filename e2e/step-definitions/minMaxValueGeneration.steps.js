const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const minMaxValueGeneration = require('../pages/minMaxValueGeneration.page');

defineSupportCode(( {Given, When, Then} ) => {
    // *********************************************************
    // Background:
    // *********************************************************
    // Shared:
    // that I am logged in to the Sierra Leone DHIS2
    When(/^I open min max value generation page$/, () => {
        minMaxValueGeneration.open();
        browser.pause(2000);
    });

    // *********************************************************
    // Commons:
    // *********************************************************
    // Generate, Remove
    When(/^User selects a data set$/, () => {
        minMaxValueGeneration.getDataSetOption().click();
    });

    Then(/^User expands an organization unit selection$/, () => {
        minMaxValueGeneration.getOrgUnitTreeExpandArrowFromTree().click();
    });

    Then(/^User can only select one organization unit$/, () => {
        minMaxValueGeneration.getOneOrgUnitTreeFromTree(1).click();
        minMaxValueGeneration.getOneOrgUnitTreeFromTree(3).click();
        expect(minMaxValueGeneration.countSelectedOrgUnit()).to.equal(1);
    });


    // *********************************************************
    // Scenario: I want to see all items in the page
    // *********************************************************
    Then(/^A column with a list of data sets is displayed$/, () => {
        expect(browser.element('select[class^=MinMaxValueGeneration__select]').isVisible()).to.equal(true);
    });

    Then(/^A column with organization unit tree is displayed$/, () => {
        expect(browser.element('.tree-view').isVisible()).to.equal(true);
    });

    Then(/^Generate action is displayed$/, () => {
        expect(browser.element('button[id=generateMinMaxBtnId').isVisible()).to.equal(true);
    });

    Then(/^Remove action is displayed$/, () => {
        expect(browser.element('button[id=removeMinMaxBtnId').isVisible()).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to generate min-max value
    // *********************************************************
    Then(/^User can click in generate$/, () => {
        browser.element('button[id=generateMinMaxBtnId').click();
    });

    // *********************************************************
    // Scenario: I want to remove min-max value
    // *********************************************************
    Then(/^User can click in remove$/, () => {
        browser.element('button[id=removeMinMaxBtnId').click();
    });
});

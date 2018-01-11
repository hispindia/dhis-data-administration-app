/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

import MaintenanceContainer from "./MaintenanceContainer";

import maintenanceCheckboxes from "./maintenance.conf";

import {
    sections,
    MAINTENANCE_SECTION_KEY,
} from '../sections.conf';
import MaintenancePage from "./MaintenancePage";
import PageContainer from "../PageContainer";

let maintenancePageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === MAINTENANCE_SECTION_KEY) {
        maintenancePageInfo = section.info;
        break;
    }
}

const t = key => key;
const showSnackbar = jest.fn();

it('MaintenanceContainer renders without crashing', () => {
    shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
});

it('MaintenanceContainer renders a GridList', () => {
    const wrapper = shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(GridList)).toHaveLength(1);
});

it('MaintenanceContainer renders needed Checkboxes', () => {
    const wrapper = shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(Checkbox)).toHaveLength(maintenanceCheckboxes.length + 1);          /* plus Checkbox to select or unselect all */
});

it('MaintenanceContainer renders a FlatButton', () => {
    const wrapper = shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(FlatButton)).toHaveLength(1);
});

it('MaintenanceContainer calls performMaintenance method when button is clicked', () => {
    const spy = spyOn(MaintenanceContainer.prototype, 'performMaintenance')
    const wrapper = shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
    wrapper.find(FlatButton).simulate('click');
    expect(spy).toHaveBeenCalled();
});

it('MaintenanceContainer renders Checkbox to select or unselect all', () => {
    const wrapper = shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(Checkbox).find('.maintenance-check-all')).toHaveLength(1);
});

it('MaintenanceContainer calls toggleCheckAll method when Checkbox to select or unselect all is checked', () => {
    const spy = spyOn(MaintenanceContainer.prototype, 'toggleCheckAll')
    const wrapper = shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
    wrapper.find(Checkbox).find('.maintenance-check-all').simulate('check');
    expect(spy).toHaveBeenCalled();
});

it('MaintenanceContainer state changes when Checkbox to select or unselect all is checked', () => {
    const wrapper = shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
    wrapper.find(Checkbox).find('.maintenance-check-all').simulate('check');
    const state = wrapper.state();
    expect(state.checkAll).toBe(true);

    // assert checkbox states
    for (let i = 0; i < maintenanceCheckboxes.length; i++) {
        const checkboxKey = maintenanceCheckboxes[i].key;
        const checkboxState = state.checkboxes[checkboxKey].checked;
        expect(checkboxState).toBe(true);
    }
});

it('MaintenanceContainer state changes Checkbox state when a Checkbox is checked', () => {
    const wrapper = shallow(<MaintenanceContainer t={t} showSnackbar={showSnackbar} />);
    const state = wrapper.state();
    const maintenanceCheckbox = wrapper.find('.maintenance-option').first();
    maintenanceCheckbox.find(Checkbox).first().simulate('check');

    // assert checkbox states
    const checkedCheckboxKey = maintenanceCheckbox.key();
    for (let i = 0; i < maintenanceCheckboxes.length; i++) {
        const checkboxKey = maintenanceCheckboxes[i].key;
        const checkboxState = state.checkboxes[checkboxKey].checked;
        expect(checkboxState).toBe(checkboxKey === checkedCheckboxKey);
    }
});

it('MaintenancePage renders without crashing', () => {
    shallow(<MaintenancePage pageInfo={maintenancePageInfo} t={t} showSnackbar={showSnackbar} />);
});

it('MaintenancePage renders a PageContainer', () => {
    const wrapper = shallow(<MaintenancePage pageInfo={maintenancePageInfo} t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(PageContainer)).toHaveLength(1);
});

it('MaintenancePage renders a MaintenanceContainer', () => {
    const wrapper = shallow(<MaintenancePage pageInfo={maintenancePageInfo} t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(MaintenanceContainer)).toHaveLength(1);
});

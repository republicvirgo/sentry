import React from 'react';
import {mount} from 'enzyme';

import MemberListStore from 'app/stores/memberListStore';
import TeamStore from 'app/stores/teamStore';

import RuleBuilder from 'app/views/settings/project/projectOwnership/ruleBuilder';

jest.mock('jquery');
describe('ProjectTeamsSettings', function() {
  let sandbox;

  let project;
  let handleAdd;
  let USER_1 = TestStubs.User({
    id: '1',
    name: 'Jane Doe',
    email: 'janedoe@example.com',
  });
  let USER_2 = TestStubs.User({
    id: '2',
    name: 'John Smith',
    email: 'johnsmith@example.com',
  });

  let TEAM_1 = TestStubs.Team({
    id: '3',
    name: 'COOL TEAM',
    slug: 'cool-team',
  });

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    sandbox.stub(MemberListStore, 'getAll').returns([USER_1, USER_2]);
    sandbox.stub(TeamStore, 'getAll').returns([TEAM_1]);

    handleAdd = jest.fn();
    project = TestStubs.Project();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('render()', function() {
    it('renders', function() {
      let wrapper = mount(
        <RuleBuilder project={project} onAddRule={handleAdd} />,
        TestStubs.routerContext()
      );

      let add = wrapper.find('RuleAddButton');
      add.simulate('click');
      expect(handleAdd).not.toHaveBeenCalled();

      let text = wrapper.find('BuilderInput');
      text.simulate('change', {target: {value: 'some/path/*'}});

      add.simulate('click');
      expect(handleAdd).not.toHaveBeenCalled();

      let openDropdown = wrapper.find('BuilderDropdownButton');
      openDropdown.simulate('click');
      let user = wrapper.find('AutoCompleteItem').first();
      user.simulate('click');

      add.simulate('click');
      expect(handleAdd).toHaveBeenCalled();

      expect(wrapper).toMatchSnapshot();
    });
  });
});

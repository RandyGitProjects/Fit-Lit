import { expect } from 'chai';
import Activity from '../src/Activity'
import mock from '../src/data/mock';
import User from '../src/User';



describe('Activity', function () {
  let activity1, user;

  beforeEach(function () {
    activity1 = new Activity(mock.activityData)
    user = new User(mock.users[0])
  })

  it('should be a function', function () {
    expect(Activity).to.be.a('function')
  });
  it('should be an instance of Activity', function () {
    expect(activity1).to.be.an.instanceOf(Activity)
  });
  // it.only('should be able to find a currentUser', function () {
  //   expect(activity1.getUserActivity(1)[0].userID).to.equal(1)
  // });

  it.only('should be able to calculate miles walked on a certain day', function () {
    expect(activity1.milesWalkedByDay(user, '2023/03/25')).to.equal(11)
  });
  // it('should be a function', function() {
  //   expect(Activity).to.be.a('function')
  // });
  // it('should be a function', function() {
  //   expect(Activity).to.be.a('function')
  // });
})

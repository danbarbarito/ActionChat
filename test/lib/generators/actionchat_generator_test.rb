require 'test_helper'
require 'generators/actionchat/actionchat_generator'

class ActionchatGeneratorTest < Rails::Generators::TestCase
  tests ActionchatGenerator
  destination Rails.root.join('tmp/generators')
  setup :prepare_destination

  # test "generator runs without errors" do
  #   assert_nothing_raised do
  #     run_generator ["arguments"]
  #   end
  # end
end

class CreateRounds < ActiveRecord::Migration[6.0]
  def change
    create_table :rounds do |t|
      t.string :correctAnswer
      t.string :selectedAnswer

      t.timestamps
    end
  end
end

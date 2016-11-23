class CreateImages < ActiveRecord::Migration[5.0]
  def change
    create_table :images do |t|
      t.attachment :asset
      t.string :alt
      t.string :link
      t.integer :email_id
      t.integer :position
      t.integer :width

      t.timestamps
    end
  end
end
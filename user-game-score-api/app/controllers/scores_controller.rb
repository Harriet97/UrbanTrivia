class ScoresController < ApplicationController
    def index
        scores = Score.all 
        render json: scores.to_json(:include => {
            :user => {:only => [:id, :username]},
            :game => {:only => [:id, :scored]}},
            :except => [:updated_at, :created_at, :user_id, :game_id])
    end

    def new
    end

    def create
        # byebug
        score = Score.create(score_params)
        render json: score   
    end

    private
    def score_params
        params.require(:score).permit(:user_id, :game_id)
    end
end

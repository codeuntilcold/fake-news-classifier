from flask import Flask, render_template, request, jsonify
import nltk
import pickle
from nltk.corpus import stopwords
import re
from nltk.stem.porter import PorterStemmer
import numpy as np

app = Flask(__name__)
ps = PorterStemmer()

model = pickle.load(open('Model/logreg_fakenews.pickle', 'rb'))
tfidfvect = pickle.load(open('Model/tfidf.pickle', 'rb'))


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


def predict(text, title, author):
    content = title + ' ' + author + ' ' + text
    print(content)
    review = re.sub('[^a-zA-Z]', ' ', content)
    review = review.lower()
    review = review.split()
    review = [ps.stem(word)
              for word in review if not word in stopwords.words('english')]
    review = ' '.join(review)

    review_vect = tfidfvect.transform([review]).toarray()
    prediction = 'giả' if model.predict(review_vect)[0] else 'thật'
    print(model.predict(review_vect))

    diction = measure_importance(review_vect)
    # print(diction)
    return prediction, diction


@app.route('/', methods=['POST'])
def webapp():
    text = request.form['textInput']
    author = request.form['authorInput']
    title = request.form['titleInput']
    prediction, diction = predict(text, title, author)
    sorted_dict = {k: v for k, v in sorted(diction.items(), key=lambda item: item[1])}
    return render_template('index.html', original=text, textInput=text, result=prediction, dis=sorted_dict)


@app.route('/predict/', methods=['GET', 'POST'])
def api():
    text = request.args.get("text")
    prediction = predict(text)
    return jsonify(prediction=prediction)


def measure_importance(review_vect):
    word_indexes = np.argwhere(review_vect[0])
    # print(word_indexes[:, 0])
    word_importance = model.coef_[0][word_indexes[:, 0]]
    # print(word_importance)
    return dict(zip(tfidfvect.get_feature_names_out()[word_indexes][:, 0], np.tanh(word_importance)))


if __name__ == "__main__":
    app.run(debug=True)

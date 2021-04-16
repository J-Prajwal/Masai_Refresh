package com.example.myapplication.viewholder

import android.view.View
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.myapplication.R
import com.example.myapplication.interface_clickListener.TopicClickListener
import kotlinx.android.synthetic.main.item_layout_topics_new.view.*

class TopicViewHolder(private val view: View, private val listener: TopicClickListener) :
    RecyclerView.ViewHolder(view) {
    val css =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/Css.JPG?alt=media&token=df456e33-bf89-4e53-8bb6-1064844c4035"
    val html =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/Html.PNG?alt=media&token=b992f284-c852-4797-a9b7-5033f27319f4"
    val ds =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/Ds.png?alt=media&token=61902161-4f03-4fd9-b17e-a01d8095448a"
    val react =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/react-2.svg?alt=media&token=14a0d8c9-6520-412a-a2aa-751d5ff888a3"
    val nodejs =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/download.png?alt=media&token=23c3cad9-5ef6-4b70-8129-791b406b2981"
    val express =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/Expressjs.png?alt=media&token=74fc7217-fa8a-4a52-b1ff-f12668bc1d93"
    val java =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/java-14.svg?alt=media&token=376d0f38-d615-4f7b-99b8-887b93878e5f"
    val node_js =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/nodejs-icon.svg?alt=media&token=0b4d0ac4-f9d4-422f-b7cb-6eecbf59cdf0"
    val sql =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/mysql-seeklogo.com.svg?alt=media&token=6ba49f3b-ce83-42e4-a693-7e92a79979ef"

    val python =
        "https://firebasestorage.googleapis.com/v0/b/splitwise-project.appspot.com/o/python-5.svg?alt=media&token=836d57f5-28fd-46d4-ae11-daa0eea54459"

    fun setData(dataItem: com.example.myapplication.model.TopicsModelUpdated.DataItem) {
        view.apply {
            when {
                dataItem.name.equals("CSS") -> {
                    Glide.with(imCircle_performance).load(css).into(imCircle_performance)
                }
                dataItem.name.equals("HTML") -> {
                    Glide.with(imCircle_performance).load(html).into(imCircle_performance)
                }
                dataItem.name.equals("EXPRESS") -> {
                    Glide.with(imCircle_performance).load(express).into(imCircle_performance)
                }
                dataItem.name.equals("JAVASCRIPT") -> {
                    Glide.with(imCircle_performance).load(R.drawable.ic_nodejs_icon).into(imCircle_performance)
                }
                dataItem.name.equals("SQL") -> {
                    Glide.with(imCircle_performance).load(R.drawable.sql).into(imCircle_performance)

                }
                dataItem.name.equals("REACT") -> {
                    Glide.with(imCircle_performance).load(R.drawable.react).into(imCircle_performance)

                }
                dataItem.name.equals("NODE_JS") -> {
                    Glide.with(imCircle_performance).load(R.drawable.ic_nodejs).into(imCircle_performance)

                }
                dataItem.name.equals("JAVA") -> {
                    Glide.with(imCircle_performance).load(R.drawable.java).into(imCircle_performance)

                }
                dataItem.name.equals("PYTHON") -> {
                    Glide.with(imCircle_performance).load(R.drawable.python).into(imCircle_performance)

                }
            }

//            }}else if(dataItem.name.equals("DS_ALGO")){
//                Glide.with(imCircle_performance).load(ds).into(ivTopicIcon)
//            }else if(dataItem.name.equals("NODE_JS")){
//                Glide.with(imCircle_performance).load(nodejs).into(ivTopicIcon)
//

            tvTopicNameNew.text = dataItem.name.toString()
            tvTotalNoOfQuestions.text=dataItem.totalNoOfQuestions.toString()
            llTopic_Click.setOnClickListener {
                listener.onItemClicked(adapterPosition, dataItem)
            }
        }
    }

}
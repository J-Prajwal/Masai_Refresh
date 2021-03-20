package com.example.myapplication.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.myapplication.R
import com.example.myapplication.interface_clickListener.TopicClickListener
import com.example.myapplication.model.DataItem
import com.example.myapplication.viewholder.TopicViewHolder

class TopicAdapter(private var dataModelList: List<DataItem>,private val listener: TopicClickListener) :
    RecyclerView.Adapter<TopicViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TopicViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_layout_topics_new, parent, false)
        return TopicViewHolder(view,listener)
    }

    override fun onBindViewHolder(holder: TopicViewHolder, position: Int) {
        val dataModel = dataModelList[position]
        holder.setData(dataModel)
    }

    override fun getItemCount(): Int {
        return dataModelList.size
    }

    fun updateList(modelList: List<DataItem>) {
        dataModelList = modelList
        notifyDataSetChanged()
    }

}
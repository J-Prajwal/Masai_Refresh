package com.example.myapplication.activities

import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.ViewModelProviders
import androidx.lifecycle.observe
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.myapplication.AttemptActivity
import com.example.myapplication.HomeActivity
import com.example.myapplication.MainActivity
import com.example.myapplication.R
import com.example.myapplication.adapter.TopicAdapter
import com.example.myapplication.interface_clickListener.TopicClickListener
import com.example.myapplication.model.DataItem
import com.example.myapplication.model.UserUIModel
import com.example.myapplication.viewModel.TopicsViewModel
import kotlinx.android.synthetic.main.activity_topics.*

class TopicsActivity : AppCompatActivity(), TopicClickListener {
    private lateinit var topicsViewModel: TopicsViewModel
    private lateinit var userAdapter: TopicAdapter
    private val dataModelList = emptyList<com.example.myapplication.model.TopicsModelUpdated.DataItem>()
    lateinit var tokenID:String
    var key : String? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_topics)
        topicsViewModel=ViewModelProviders.of(this).get(TopicsViewModel::class.java)
        val sp : SharedPreferences = getSharedPreferences("LOGIN", MODE_PRIVATE)
        key = sp.getString("login_key",null)
        setRecyclerAdapter()
        observeLiveData()
        flProgressBar.visibility = View.VISIBLE
        var str : String = intent.getStringExtra("token")!!
//        if(str.isEmpty()) str = key.toString()
        tokenID="Bearer $key"
        topicsViewModel.callAPI(str)
    }

    private fun observeLiveData() {
    topicsViewModel.liveData.observe(this,{
    when(it){
        is UserUIModel.Success ->{
            Log.d("sssssssssssssssssssss",it.toString())
            userAdapter.updateList(it.dateModelList)
            flProgressBar.visibility=View.GONE
        }

        is UserUIModel.Failure ->{
            Toast.makeText(this@TopicsActivity,"Error message ${it.error}",Toast.LENGTH_SHORT).show()
            flProgressBar.visibility=View.GONE
        }
    }
})

    }

    private fun setRecyclerAdapter() {
        userAdapter = TopicAdapter(dataModelList,this)
        val layoutManager = GridLayoutManager(this,2)
        recyclerView.apply {
            this.layoutManager = layoutManager
            adapter = userAdapter
        }
    }

    override fun onItemClicked(position: Int, dataItem: com.example.myapplication.model.TopicsModelUpdated.DataItem) {
        val intent=Intent(this,AttemptActivity::class.java)
        intent.putExtra("topicId",dataItem.id)
        intent.putExtra("token",tokenID)
        startActivity(intent)
        Toast.makeText(this, dataItem.id, Toast.LENGTH_SHORT).show()


    }

}

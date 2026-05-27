package com.ngoconnect.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ngoconnect.entities.Item;
import com.ngoconnect.repositories.ItemRepository;
@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")

public class ItemController {
	private ItemRepository itemRepo;
	public ItemController(ItemRepository itemRepo ) {
		this.itemRepo=itemRepo;
	}
	
	@GetMapping
	public List<Item> getAllItems(){
		return itemRepo.findAll();
	}
	
}

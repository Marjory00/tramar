import { useState, useMemo, useCallback } from 'react';
import { 
    Container, 
    Typography, 
    Grid, 
    Box, 
    Card, 
    CardContent, 
    Button, 
    Divider, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';

// Import Icons
import BuildIcon from '@mui/icons-material/Build';
import CpuIcon from '@mui/icons-material/DeveloperBoard';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import GpuIcon from '@mui/icons-material/Memory'; // Using Memory icon for GPU for simplicity
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// --- Configuration Data Mock ---
const CONFIG_OPTIONS = {
    cpu: [
        { id: 'cpu-1', name: 'Intel Core i5-14600K', price: 300, icon: CpuIcon },
        { id: 'cpu-2', name: 'Intel Core i9-14900K', price: 600, icon: CpuIcon },
        { id: 'cpu-3', name: 'AMD Ryzen 7 7700X', price: 350, icon: CpuIcon },
    ],
    gpu: [
        { id: 'gpu-1', name: 'NVIDIA RTX 4070', price: 700, icon: GpuIcon },
        { id: 'gpu-2', name: 'NVIDIA RTX 4090', price: 1800, icon: GpuIcon },
        { id: 'gpu-3', name: 'AMD Radeon RX 7900 XT', price: 900, icon: GpuIcon },
    ],
    ram: [
        { id: 'ram-1', name: '16GB DDR5 5600MHz', price: 100, icon: MemoryIcon },
        { id: 'ram-2', name: '32GB DDR5 6000MHz', price: 180, icon: MemoryIcon },
    ],
    storage: [
        { id: 'ssd-1', name: '1TB NVMe SSD', price: 80, icon: StorageIcon },
        { id: 'ssd-2', name: '2TB NVMe SSD', price: 150, icon: StorageIcon },
    ]
};

// --- Initial State - Select the first option from each category ---
const INITIAL_CONFIG = {
    cpu: CONFIG_OPTIONS.cpu[0].id,
    gpu: CONFIG_OPTIONS.gpu[0].id,
    ram: CONFIG_OPTIONS.ram[0].id,
    storage: CONFIG_OPTIONS.storage[0].id,
};

// Helper function to find the full item object by its ID
const findItem = (category, itemId) => 
    CONFIG_OPTIONS[category].find(item => item.id === itemId);


const BuilderPage = () => {
    // State to hold the user's selected components
    const [selectedConfig, setSelectedConfig] = useState(INITIAL_CONFIG);

    // Handler for changes in the component dropdowns
    const handleConfigChange = useCallback((event) => {
        const { name, value } = event.target;
        setSelectedConfig(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    // Memoized calculation of the total price and summary list
    const { totalPrice, summaryList } = useMemo(() => {
        let total = 0;
        const summary = [];

        Object.entries(selectedConfig).forEach(([category, itemId]) => {
            const item = findItem(category, itemId);
            if (item) {
                total += item.price;
                summary.push({ 
                    category: category.toUpperCase(), 
                    name: item.name, 
                    price: item.price,
                    icon: item.icon // Pass the icon for the summary list
                });
            }
        });

        return { totalPrice: total, summaryList: summary };
    }, [selectedConfig]);

    // Helper component for the Configuration Control
    const ConfigControl = ({ category, label, options, currentId, onChange }) => (
        <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select
                value={currentId}
                label={label}
                name={category}
                onChange={onChange}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>{option.name}</span>
                            <Typography variant="body2" color="primary">
                                ${option.price.toLocaleString()}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
            <Box textAlign="center" mb={6}>
                <Typography 
                    variant="h2" 
                    component="h1" 
                    fontWeight={800} 
                    sx={{ mb: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                >
                    Build Your System <BuildIcon color="primary" sx={{ fontSize: '1em', verticalAlign: 'middle' }} />
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Select your components below to customize your perfect machine.
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 4, md: 6 }}>
                
                {/* === COLUMN 1: CONFIGURATION CONTROLS === */}
                <Grid item xs={12} lg={7}>
                    <Card elevation={4} sx={{ p: { xs: 2, sm: 4 }, height: '100%', borderRadius: 2 }}>
                        <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
                            Component Selection
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {/* CPU Selector */}
                        <ConfigControl
                            category="cpu"
                            label="Processor (CPU)"
                            options={CONFIG_OPTIONS.cpu}
                            currentId={selectedConfig.cpu}
                            onChange={handleConfigChange}
                        />

                        {/* GPU Selector */}
                        <ConfigControl
                            category="gpu"
                            label="Graphics Card (GPU)"
                            options={CONFIG_OPTIONS.gpu}
                            currentId={selectedConfig.gpu}
                            onChange={handleConfigChange}
                        />

                        {/* RAM Selector */}
                        <ConfigControl
                            category="ram"
                            label="System Memory (RAM)"
                            options={CONFIG_OPTIONS.ram}
                            currentId={selectedConfig.ram}
                            onChange={handleConfigChange}
                        />

                        {/* Storage Selector */}
                        <ConfigControl
                            category="storage"
                            label="Primary Storage (SSD)"
                            options={CONFIG_OPTIONS.storage}
                            currentId={selectedConfig.storage}
                            onChange={handleConfigChange}
                        />

                    </Card>
                </Grid>

                {/* === COLUMN 2: VISUALIZER & SUMMARY === */}
                <Grid item xs={12} lg={5}>
                    <Card elevation={6} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, bgcolor: 'background.paper' }}>
                        
                        {/* 3D Visualizer Placeholder */}
                        <Box 
                            sx={{ 
                                height: 250, 
                                bgcolor: 'grey.300', 
                                mb: 4, 
                                borderRadius: 1, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                [3D System Visualizer Placeholder]
                            </Typography>
                        </Box>

                        {/* Configuration Summary */}
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Current Configuration
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <List dense>
                            {summaryList.map((item, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemIcon sx={{ minWidth: 35 }}>
                                        {/* Dynamic Icon based on component type */}
                                        <item.icon color="action" /> 
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.name} 
                                        secondary={item.category}
                                    />
                                    <Typography variant="body2" fontWeight="bold">
                                        +${item.price.toLocaleString()}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>

                        <Divider sx={{ my: 3 }} />

                        {/* Total Price & CTA */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" fontWeight={800} color="text.primary">
                                Total Price:
                            </Typography>
                            <Typography variant="h4" fontWeight={800} color="secondary.main">
                                ${totalPrice.toLocaleString()}
                            </Typography>
                        </Box>
                        
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            endIcon={<ShoppingCartIcon />}
                            sx={{ py: 1.5, fontWeight: 700, mt: 1 }}
                        >
                            Add to Cart
                        </Button>
                        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
                            Estimated build time: 3-5 business days.
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default BuilderPage;
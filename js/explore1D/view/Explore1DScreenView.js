// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Explore1DVectorCreatorPanels = require( 'VECTOR_ADDITION/explore1D/view/Explore1DVectorCreatorPanels' );
  const GridPanel = require( 'VECTOR_ADDITION/common/view/GridPanel' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );


  class Explore1DScreenView extends ScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      super();

      const horizontalScene = new SceneNode( explore1DModel, explore1DModel.horizontalGraph );
      const verticalScene = new SceneNode( explore1DModel, explore1DModel.verticalGraph );


      const explore1DVectorCreatorPanels = new Explore1DVectorCreatorPanels(
        explore1DModel.horizontalGraph.vectors,
        explore1DModel.horizontalGraph.modelViewTransformProperty,
        explore1DModel.verticalGraph.vectors,
        explore1DModel.verticalGraph.modelViewTransformProperty );

      // create the vector panels
      const horizontalVectorCreatorPanel = explore1DVectorCreatorPanels.horizontalVectorCreatorPanel;
      const verticalVectorCreatorPanel = explore1DVectorCreatorPanels.verticalVectorCreatorPanel;


      explore1DModel.vectorOrientationProperty.link( ( vectorOrientation ) => {
        switch( vectorOrientation ) {
          case VectorOrientations.HORIZONTAL:
            verticalScene.visible = false;
            verticalVectorCreatorPanel.visible = false;
            horizontalScene.visible = true;
            horizontalVectorCreatorPanel.visible = true;
            break;
          case VectorOrientations.VERTICAL:
            verticalScene.visible = true;
            verticalVectorCreatorPanel.visible = true;
            horizontalVectorCreatorPanel.visible = false;
            horizontalScene.visible = false;
            break;
          case VectorOrientations.ALL:
            throw new Error( 'explore1D cannot support all vector orientation' );
          default:
            throw new Error( 'Vector orientation not handled', vectorOrientation );
        }
      } );

      // TODO:: find better way to deal with absence of angle
      const angleVisibleProperty = new BooleanProperty( false );

      const gridPanel = new GridPanel( explore1DModel.sumVisibleProperty,
        explore1DModel.valuesVisibleProperty,
        angleVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.componentStyleProperty, {
          right: this.layoutBounds.maxX - 4,
          top: 10
        } );

      const ArrowNodeOptions = { fill: 'black', doubleHead: true, tailWidth: 3, headWidth: 8, headHeight: 10 };
      // Scene radio buttons
      const sceneRadioButtonContent = [ {
        value: VectorOrientations.HORIZONTAL,
        node: new ArrowNode( 0, 0, 40, 0, ArrowNodeOptions )
      }, {
        value: VectorOrientations.VERTICAL,
        node: new ArrowNode( 0, 0, 0, 40, ArrowNodeOptions )
      } ];

      const sceneRadioButtonGroup = new RadioButtonGroup( explore1DModel.vectorOrientationProperty, sceneRadioButtonContent, {
        baseColor: 'white',
        selectedStroke: '#419ac9',
        selectedLineWidth: 2,
        right: this.layoutBounds.maxX - 4,
        top: gridPanel.bottom + 10,
        orientation: 'horizontal'
      } );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          explore1DModel.reset();
          horizontalScene.reset();
          verticalScene.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

      this.setChildren( [
        horizontalScene,
        verticalScene,
        horizontalVectorCreatorPanel,
        verticalVectorCreatorPanel,
        gridPanel,
        sceneRadioButtonGroup,
        resetAllButton
      ] );
    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );